
/**
 * @swagger
 * /registration/signup:
 *  post:
 *    description: Use to add users
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/signup'
 *    responses:
 *      '200':
 *        description: User successfully added
 */

/**
 * @swagger
 * /registration/login:
 *  post:
 *    description: Use to login users
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/login'
 *    responses:
 *      '200':
 *        description: User successfully login
 */

// changePassword
/**
 * @swagger
 * /registration/changePass:
 *  put:
 *    description: Use to change users password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/login'
 *    responses:
 *      '200':
 *        description: User successfully changed password
 */

/**
 * @swagger
 * /registration/refreshToken/{id}:
 *  get:
 *    description: Use to get new access token
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: Numeric ID required
 *    responses:
 *      '200':
 *        description: user is succesfully logout
 */
/**
 * @swagger
 * /registration/logout/{id}:
 *  delete:
 *    description: Use to logout user
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: Numeric ID required
 *    responses:
 *      '200':
 *        description: user is succesfully logout
 */