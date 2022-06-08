

// Routes
/**
 * @swagger
 *  components:
 *    schemas:
 *      signup:
 *        type: object
 *        properties:
 *          id:
 *            type: number
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
 *          token:
 *            type: string
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
 *          name:
 *            type: string
 *          blog_post:
 *            type: string
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      postblog:
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
