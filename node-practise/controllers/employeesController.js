const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstname,
    secondname: req.body.secondname,
  };

  if (!newEmployee?.firstname || !newEmployee?.secondname) {
    return res
      .status(400)
      .json({ message: "First and scond names are required." });
  }

  data.setEmployees([...data.newEmployee, newEmployee]);
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  // todo:
  res.json({
    firstname: req.body.firstname,
    secondname: req.body.secondname,
  });
};

const deleteEmployee = (req, res) => {
  // todo:
  res.json({ id: req.body.id });
};

const getAnEmployee = (req, res) => {
  // todo:
  res.json({ id: req.params.id });
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getAnEmployee,
};
