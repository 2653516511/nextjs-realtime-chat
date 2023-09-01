const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await User.find();
  if (!employees) {
    return res.status(204).json({ message: "No employees found." });
  }
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  const reqName = {
    firstname: req.body.firstname,
    secondname: req.body.secondname,
  };

  if (!reqName?.firstname || !reqName?.secondname) {
    return res
      .status(400)
      .json({ message: "First and second names are required." });
  }

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      secondname: req.body.secondname,
    });

    console.log("----create employee", result);
    res.status(201).json(result);
  } catch (error) {
    console.error("----create employee", error);
  }
};

const updateEmployee = async (req, res) => {
  // fist: check if req.body contains id
  if (!res.body.id) {
    return res.status(400).json({ message: "ID paramter is required" });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` });
  }

  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.secondname) employee.secondname = req.body.secondname;

  const result = await employee.save();
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!res.body.id) {
    return res.status(400).json({ message: "Employee id is required" });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` });
  }

  const result = await employee.deleteOne(); // {_id: req.body.id}
  res.json(result);
};

const getAnEmployee = async (req, res) => {
  if (!res.body.id) {
    return res.status(400).json({ message: "Employee id is required" });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` });
  }

  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getAnEmployee,
};
