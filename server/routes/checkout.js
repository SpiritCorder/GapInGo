// CONTAINS ALL CHECKOUT ROUTES

import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

import OrderSchema from '../model/Order.js';
import ProductSchema from '../model/Product.js';

dotenv.config(); // load env variables

const stripe = Stripe(process.env.STRIPE_KEY);

import {auth} from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();


// @desc buy it now stripe checkout session
// @route POST /api/checkout/buy-it-now
// @access Private

router.post('/buy-it-now', auth, async (req, res, next) => {
  const {productId, qty, shippingMethod, shipToCountry, variationId=null} = req.body;

  try {
    const product = await ProductSchema.findById(productId).lean().exec();

    if(!product) return res.status(404).json({message: 'Product not found'});

    const shipToCountryFound = product.shippingCountries.map(c => c.isoCode === shipToCountry);

    if(!shipToCountryFound) return res.status(400).json({message: 'Product does not ship to selected country'});

    // check whether the product has variations or not
    if(product.variations.values.length > 0 && !variationId) {
      return res.status(400).json({message: 'Product has variations, please select a variations and buy it'});
    }

    let stripeProduct;

    let lineItems = [];

    if(variationId) {
      const selectedVariation = product.variations.values.find(v => v._id.toString() === variationId.toString());
      if(!selectedVariation) return res.status(404).json({message: 'Selected variation does not exist'});
      const price = +((selectedVariation.price * 100).toFixed(2));
      
      lineItems[0] = {
        price_data: {
            currency: 'usd',
            // product: stripeProduct.id,
            product_data: {
                name: product.title,
                description: `you are buying a variation of this product, Variation Name: ${product.variations.name}, Variation Type: ${selectedVariation.val}`,
                images: [selectedVariation.image.url],
                metadata: {
                  productId: product._id.toString(),
                  hasVariation: true,
                  variationId: variationId,
                  image: selectedVariation.image.url,
                  shippingMethod: shippingMethod.method,
                  isFreeShipping: shippingMethod.isFreeShipping ? 'true' : 'false',
                  shippingPrice: shippingMethod.isFreeShipping ? undefined : shippingMethod.shippingPrice,
                  additionalShippingPrice: shippingMethod.additionalShippingPrice > 0 ? shippingMethod.additionalShippingPrice : undefined,
                  isReturnsAccepted: product.returns.type === 'not-accepted' ? 'false' : 'true',
                  maxDaysAccepted: product.returns.type === 'accepted-within-7-days' ? '7' : product.returns.type === 'accepted-within-15-days' ? '15' : '0',
                  returnsShippingCostPaidBy: product.returns.returnShippingCostPaidBy === 'buyer' ? 'buyer' : product.returns.returnShippingCostPaidBy === 'seller' ? 'seller' : '',
                  handlingTime: product.handlingTime
                }
            },
            tax_behavior: "exclusive",
            unit_amount_decimal: price
        },
        quantity: qty
      }

    } else {

      const price = +((product.regularPrice * 100).toFixed(2));

      lineItems[0] = {
        price_data: {
            currency: 'usd',
            // product: stripeProduct.id,
            product_data: {
                name: product.title,
                images: [product.images[0].url],
                metadata: {
                  productId: product._id.toString(),
                  hasVariation: false,
                  image: product.images[0].url,
                  shippingMethod: shippingMethod.method,
                  isFreeShipping: shippingMethod.isFreeShipping ? 'true' : 'false',
                  shippingPrice: shippingMethod.isFreeShipping ? undefined : shippingMethod.shippingPrice,
                  additionalShippingPrice: shippingMethod.additionalShippingPrice > 0 ? shippingMethod.additionalShippingPrice : undefined,
                  isReturnsAccepted: product.returns.type === 'not-accepted' ? 'false' : 'true',
                  maxDaysAccepted: product.returns.type === 'accepted-within-7-days' ? '7' : product.returns.type === 'accepted-within-15-days' ? '15' : '0',
                  returnsShippingCostPaidBy: product.returns.returnShippingCostPaidBy === 'buyer' ? 'buyer' : product.returns.returnShippingCostPaidBy === 'seller' ? 'seller' : '',
                  handlingTime: product.handlingTime
                }
            },
            tax_behavior: "exclusive",
            unit_amount_decimal: price
        },
        quantity: qty
      }
    }

    // create allowed country iso codes array
    // const allowedCountries = product.shippingCountries.map(c => c.isoCode);

    let shippingAmount;
    if(shippingMethod.isFreeShipping) {
      shippingAmount = 0;
    } else if(qty > 1 && shippingMethod.additionalShippingPrice > 0) {
      const additionalQty = +qty - 1;
      const additionalQtyCost = additionalQty * shippingMethod.additionalShippingPrice;
      shippingAmount = (shippingMethod.shippingPrice + additionalQtyCost) * 100;
    } else {
      shippingAmount = shippingMethod.shippingPrice * 100;
    }

    // CREATE A STRIPE CUSTOMER AND SEND THE EMAIL
    const customer = await stripe.customers.create({
      email: req.user.email
    });

    // CREATE A NEW STRIPE CHECKOUT SESSION
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      customer_update: {
        shipping: 'auto'
      },
      client_reference_id: req.user._id.toString(),
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: [shipToCountry],
      },
      shipping_options: [{
        shipping_rate_data: {
          display_name: shippingMethod.method,
          type: 'fixed_amount',
          fixed_amount: {
            amount: shippingAmount,
            currency: 'usd'
          },
          tax_behavior: 'exclusive'
        }
      }],  
      line_items: lineItems,
      automatic_tax: {
        enabled: true,
      },
      // customer: req.user._id,
      // customer_update: {
      //   shipping: 'auto',
      // },
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/products/${productId}`
    });
  
    res.status(200).json({url: session.url});

  } catch (err) {
    console.log(err);
  }
})



// checkout route
// protected route
router.post('/pay', auth, async (req, res, next) => {

    // get the order id from the body
    const {orderId} = req.body;

    try {
        const results = await OrderSchema.findById(mongoose.Types.ObjectId(orderId)).select('orderItems').populate('orderItems.product').skip();
        console.log(results.orderItems);
        const cartItems = results.orderItems.map(item => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.product.name,
                        description: item.product.description,
                        images: [`https://picsum.photos/id/1018/1000/600/`]
                    },
                    unit_amount_decimal: item.price * 100
                },
                quantity: item.qty
            }
        }) 

        

        const session = await stripe.checkout.sessions.create({
            shipping_address_collection: {
              allowed_countries: ['US', 'CA'],
            },
            line_items: cartItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment-success`,
            cancel_url: `${process.env.CLIENT_URL}/orders/${orderId}`,
        });
        
        res.status(200).json({url: session.url});

    } catch (err) {
        console.log(err);
        next(err);
    }

});


// @desc GET THE ORDER DETAILS AFTER CHECKOUT SUCCESS
// @route GET /api/checkout/success
// @access PROTECTED

router.get('/success', auth, async (req, res, next) => {
  const checkoutSessionId = req.query.session_id;

  try {
    // ONLY FETCH CHECKOUT SESSION LINE ITEMS
    // const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSessionId);

    // FETCH THE WHOLE CHECKOUT SESSION DATA WITH LINE ITEMS
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
      expand: ['line_items'],
    });

    // LOOP THROUGH LINE ITEMS ARRAY AND FETCH DETAILS ABOUT EVERY PRODUCT THAT HAD BEEN ORDERED
    let orderItems = [];
    for(let item of session.line_items.data) {
      const product = await stripe.products.retrieve(item.price.product);

      const orderItem = {
        id: product.id,
        name: product.name,
        description: product.description ? product.description : undefined,
        quantity: item.quantity,
        unitPrice: (+item.price.unit_amount_decimal / 100).toFixed(2),
        image: product.images[0],
        orderItemTotal: item.quantity * +((+item.price.unit_amount_decimal / 100).toFixed(2))
      }
      orderItems.push(orderItem);
    }

    const successResponse = {
      orderItems,
      orderTotal: session.amount_total / 100,
      currency: session.currency.toUpperCase()
    }

    // CREATE A BETTER RESPONSE OBJECT THAT CONTAINS MOST IMPORTANT DATA ABOUT THE CHECKOUT (INSTEAD OF SENDING THE WHOLE SESSION)
    // TO DO

    res.status(200).json({message: 'Success', checkoutSessionInfo: successResponse});
  } catch (err) {
    console.log(err);
    next(err);
  }
})





// checkout success webhook
// sent by Stripe after some event happens full api path --> /api/checkout/payment-success-webhook

router.post('/payment-success-webhook', express.raw({type: 'application/json'}), async (request, response) => {

  // WITH SIGNATURE VERIFICATION
  const sig = request.headers['stripe-signature'];
  const payload = request.body;
  const endpointSecret = "whsec_2e0ce80b25386d607729065fccddf9728cbd27b04cfdec000c7ffe50dfe57349";


  let event; // the stripe webhook event data

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.log(err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch(event.type) {
    case 'checkout.session.completed': {
      // CHECKOUT SESSION COMPLETED, BUT SOMETIMES STILL NOT PAID (SO CHECK THE PAYMENT STATUS)
      const session = event.data.object;

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      
      const orderItems = [];
      for(let item of lineItems.data) {
        const product = await stripe.products.retrieve(item.price.product);
        
        const orderItem = {
          productInfo: {
            id: product.metadata.productId,
            title: product.name,
            unitPrice: (+item.price.unit_amount_decimal / 100),
            hasVariation: product.metadata.hasVariation === 'true' ? true : false,
            image: product.images[0]
          },
          totalPrice: item.quantity * (+item.price.unit_amount_decimal / 100),
          qty: item.quantity,
          shippingInfo: {
            method: product.metadata.shippingMethod,
            isFreeShipping: product.metadata.isFreeShipping === 'true' ? true : false
          }
        }

        if(product.metadata.isFreeShipping === 'false') {
          orderItem.shippingInfo.shippingPrice = +product.metadata.shippingPrice;
        }

        if(product.metadata.isFreeShipping === 'false' && product.metadata?.additionalShippingPrice) {
          orderItem.shippingInfo.additionalShippingPrice = +product.metadata.additionalShippingPrice;
        }

        if(product.metadata.hasVariation === 'true') {
          orderItem.productInfo.variationId = product.metadata.variationId;
          orderItem.productInfo.description = product.description;
        }

        // SET EACH ORDER ITEM RETURN POLICIES
        if(product.metadata.isReturnsAccepted === 'true') {
          orderItem.returnsInfo = {
            isAccepted: true,
            maxDaysAccept: product.metadata.maxDaysAccepted,
            shippingCostPaidBy: product.metadata.returnsShippingCostPaidBy
          }
        } else {
          orderItem.returnsInfo = {
            isAccepted: false
          }
        }

        // SET EACH ORDER ITEM MILESTONE
        if(session.payment_status === 'paid') {
          orderItem.milestones = [{milestone: 'item_paid', date: new Date()}];
        } else {
          orderItem.milestones = [{milestone: 'item_payment_pending', date: new Date()}];
        }

        orderItem.handlingTime = product.metadata.handlingTime;

        orderItems.push(orderItem);
      }

      // CREATE NEW ORDER TO SAVE IN THE DATABASE
      const newOrder = {
        customer: session.client_reference_id,
        orderItems,
        shippingDetails: {
          address: {
            country: session.shipping.address.country,
            city: session.shipping.address.city,
            state: session.shipping.address.state ? session.shipping.address.state : undefined,
            addressLine1: session.shipping.address.line1,
            addressLine2: session.shipping.address.line2 || null,
            postalCode: session.shipping.address.postal_code
          },
          name: session.shipping.name ? session.shipping.name : undefined
        },
        billingDetails: {
          address: {
            country: session.customer_details.address.country,
            city: session.customer_details.address.city,
            state: session.customer_details.address.state ? session.customer_details.address.state : undefined,
            addressLine1: session.customer_details.address.line1,
            addressLine2: session.customer_details.address.line2 || null,
            postalCode: session.customer_details.address.postal_code
          },
          email: session.customer_details.email ? session.customer_details.email : undefined,
          name: session.customer_details.name ? session.customer_details.name : undefined
        },
        paymentMethod: 'stripe',
        paymentDetails: {
          sessionId: session.id,
          paymentIntentId: session.payment_intent,
          paymentMethodTypes: session.payment_method_types
        },
        taxPrice: session.total_details.amount_tax / 100,
        shippingCost: session.total_details.amount_shipping / 100,
        totalPrice: session.amount_total / 100,
        orderMilestones: [{milestone: 'order_placed', milestoneDate: new Date()}]
      }

      let currentOrderMilestone;
      if (session.payment_status === 'paid') {
        // IF PAID, THEN UPDATE THE ORDER PAYMENT STATUS TO PAID
        newOrder.paymentDetails.paidStatus = 'paid';
        newOrder.paymentDetails.isPaid = true;
        currentOrderMilestone = {
          milestone: 'order_paid',
          milestoneDate: new Date()
        }
      } else {
        // IF NOT PAID, THEN UPDATE THE ORDER PAYMENT STATUS TO AWAITING PAYMENT
        newOrder.paymentDetails.paidStatus = 'awaiting_payment';
        newOrder.paymentDetails.isPaid = false;
        currentOrderMilestone = {
          milestone: 'order_payment_pending',
          milestoneDate: new Date()
        }
      }
      newOrder.orderMilestones = [...newOrder.orderMilestones, currentOrderMilestone];

      // CREATE NEW ORDER IN DATABASE
      await OrderSchema.create(newOrder);
      break;
    }
    
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object;
      console.log('PAYMENT WAS SUCCESSFUL');
      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object;
      console.log('PAYMENT WAS NOT SUCCESSFUL, PLEASE TRY AGAIN');

      // Send an email to the customer asking them to retry their order
      console.log('Sorry, payment did not go through, try again');
      break;
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send().end();
});



export default router;