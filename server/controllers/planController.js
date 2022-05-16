const db = require("../database");

// GET /plans - All plans
const getPlans = (req, res) => {
  db.query("SELECT * FROM plan", (err, result) => {
    res.json(result);
  });
};

// GET /plans/:appAcronym - Plan by app_acronym
const getPlanByApp = (req, res) => {
  const { appAcronym } = req.params;
  db.query(
    "SELECT * FROM plan WHERE plan_app_acronym = ?",
    appAcronym,
    (err, result) => {
      if (err) {
        res.json({ err: err });
      } else {
        if (result.length > 0) {
          res.json(result);
        } else {
          res.json({ message: `No plans under ${appAcronym}.` });
        }
      }
    }
  );
};

// GET /plans/:appAcronym/:planName - Plan by app acronym and plan name
const getPlanByAppAndName = (req, res) => {
  const { appAcronym, planName } = req.params;
  db.query(
    "SELECT * FROM plan WHERE plan_app_acronym = ? AND plan_MVP_name = ?",
    [appAcronym, planName],
    (err, result) => {
      if (err) {
        res.json({ err: err });
      } else {
        if (result.length > 0) {
          res.json(result);
        } else {
          res.json({ message: "No such plan!" });
        }
      }
    }
  );
};

// POST /plan/create - Create new plan
const addNewPlan = (req, res) => {
  const {
    planMVPName,
    planStartDate,
    planEndDate,
    planAppAcronym,
    planDescription,
  } = req.body;
  db.query(
    "SELECT * FROM plan WHERE plan_MVP_name = ?",
    planMVPName,
    (err, result) => {
      if (err) {
        res.json({ err: err });
      } else {
        if (result.length > 0) {
          res.json({ message: "MVP Plan name already exists!" });
        } else {
          db.query(
            "INSERT INTO plan (plan_MVP_name, plan_startDate, plan_endDate, plan_app_acronym, plan_description) VALUES (?,?,?,?,?)",
            [
              planMVPName,
              planStartDate,
              planEndDate,
              planAppAcronym,
              planDescription,
            ],
            (err, result) => {
              if (err) {
                res.json({ err: err });
              } else {
                if (result) {
                  res.json({ message: "New application plan created!" });
                } else {
                  res.json({
                    message: "Failed to create new application plan!",
                  });
                }
              }
            }
          );
        }
      }
    }
  );
};

// PUT /plan/update/:appAcronym/:planName
const updatePlan = (req, res) => {
  const { planDescription, planStartDate, planEndDate } = req.body;
  const { appAcronym, planName } = req.params;
  db.query(
    "UPDATE plan SET plan_description =  ?, plan_startDate = ?, plan_endDate = ? WHERE plan_app_acronym = ? AND plan_MVP_name = ?",
    [planDescription, planStartDate, planEndDate, appAcronym, planName],
    (err, result) => {
      if (err) {
        res.json({ err: err });
      } else {
        if (result) {
          res.json({ message: "Plan updated!" });
        } else {
          res.json({ message: "Failed to update plan!" });
        }
      }
    }
  );
};

module.exports = {
  getPlans,
  addNewPlan,
  getPlanByApp,
  getPlanByAppAndName,
  updatePlan,
};
