
// admin get the list of all basic users
/**
 * @swagger
 * /admin/getUsers/{id}:
 *   get:
 *     summary: Returns the list of all basic users
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: Numeric ID required
 *     responses:
 *       200:
 *         description: The list of the basic users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/users'
 *       404:
 *         description: The users were not found
 */

// admin - get all blogs
/**
 * @swagger
 * /admin/getallblog/{id}:
 *   get:
 *     summary: Returns the list of all basic users blog
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: Numeric ID required
 *     responses:
 *       200:
 *         description: The list of the basic users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       404:
 *         description: The users were not found
 */


// admin update non-admin data
/**
 * @swagger
 * /admin/updateUser/{id}:
 *  put:
 *    summary: Use to update basic user
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema:
 *          type: number
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/updateUser'
 *    responses:
 *      '200':
 *        description: user is succesfully updated
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/users'
 */


//  admin delete non-admin data
/**
 * @swagger
 * /admin/deleteUser/{id}:
 *  delete:
 *    description: Use to delete user
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema:
 *          type: number
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/users'
 *    responses:
 *      '200':
 *        description: user is succesfully deleted
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/users'
 */
