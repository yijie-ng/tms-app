const db = require("../database");

// POST - Create new plan
const addNewPlan = (req, res) => {
    const { planMVPName, planStartDate, planEndDate, planAppAcronym } = req.body;
    db.query("INSERT INTO plan (plan_MVP_name, plan_startDate, plan_endDate, plan_app_acronym) VALUES (?,?,?,?)", [planMVPName, planStartDate, planEndDate, planAppAcronym], (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result) {
                res.json({ message: "New application plan created!" });
            } else {
                res.json({ message: "Failed to create new application plan!" });
            };
        };
    });
};