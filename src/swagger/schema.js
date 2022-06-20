

// Routes
/**
 * @swagger
 *  components:
 *    schemas:
 *      signup:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          role:
 *            type: string
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      login:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          password:
 *            type: string
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      changePassword:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          oldPassword:
 *            type: string
 *          newPassword:
 *            type: string
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      updateUser:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *          name:
 *            type: string
 *          email:
 *            type: string
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      logout:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *          
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      Blog:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *          title:
 *            type: string
 *          post:
 *            type: string
 *          userId:
 *            type: number
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      createblog:
 *        type: object
 *        properties:
 *          title:
 *            type: string
 *          post:
 *            type: string
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      deleteblog:
 *        type: object
 *        properties:
 *          title:
 *            type: string
 */
