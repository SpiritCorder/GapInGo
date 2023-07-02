import bcryptjs from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: '123456',
        isAdmin: true
    }, 
    {
        name: 'Sahan Ekanayaka',
        email: 'sahan@gmail.com',
        password: '123456',
        isAdmin: false
    },
    {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '123456',
        isAdmin: false
    }
].map(user => {
    const salt = bcryptjs.genSaltSync(12);
    const hashedPassword = bcryptjs.hashSync(user.password, salt);

    return {
        ...user,
        password: hashedPassword
    }
});

export default users;