const authValidations = {
  sign_up: [
    {
      path: 'first_name', required: true, length: { min: 2, max: 20 }
    },
    {
      path: 'last_name', required: true, length: { min: 2, max: 20 }
    },
    {
      path: 'username', optional: true, length: { max: 20 }
    },
    {
      path: 'email', required: true, email: true
    },
    {
      path: 'phone', optional: true, phone: true
    },
    {
      path: 'password', required: true, length: { min: 8, max: 20 }
    }
  ],

  activate: [
    {
      path: 'secret', required: true, length: { min: 8, max: 8 }, where: 'param'
    }
  ],

  sign_in: [
    {
      path: 'email', required: true, email: true
    },
    {
      path: 'password', required: true, length: { min: 8, max: 20 }
    }
  ]
}

export default authValidations;
