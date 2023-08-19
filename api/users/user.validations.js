const userValidations = {
  get_user: [
    {
      path: 'user_id', required: true, mongo: true, where: 'param'
    }
  ],

  update_user: [
    {
      path: 'user_id', required: true, mongo: true, where: 'param'
    },
    {
      path: 'first_name', required: true, length: { min: 2, max: 20 }
    },
    {
      path: 'last_name', required: true, length: { min: 2, max: 20 }
    },
    {
      path: 'username', required: true, length: { max: 20 }
    },
    {
      path: 'email', optional: true, email: true
    },
    {
      path: 'phone', optional: true, phone: true
    },
    {
      path: 'password', optional: true, length: { min: 8, max: 20 }
    }
  ]
}

export default userValidations;
