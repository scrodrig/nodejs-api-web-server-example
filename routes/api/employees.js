const express = require('express');
const router = express.Router();
const {
    getAllEmployees,
    getEmployee,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
} = require('../../controllers/employeesController');

router
    .route('/')
    .get(getAllEmployees)
    .post(createNewEmployee)
    .put(updateEmployee)
    .delete(deleteEmployee);

router.route('/:id').get(getEmployee);

module.exports = router;
