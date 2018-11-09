const express = require('express');
const actionDb = require('../data/helpers/actionModel');

const router = express.Router();


const sendErr = (errCode, msg, res) => {
    res.status(errCode);
    res.json({ Error: msg })
};

//get actions

router.get('/', (req, res) => {
    actionDb
        .get()
        .then(action => {
            res.status(200).json(action)
        })
        .catch(err => {
            sendErr(500, 'actions not found')
        });
});


router.get('/:id', (req, res) => {
    const { id } = req.params;
    actionDb
        .get(id)
        .then(action => {
            res.status(200).json(action)
        })
        .catch(err => {
            sendErr(500, 'action not found')
        });
});

// new action 

router.post('/', async (req, res) => {
    try {
        const { project_id, description, notes } = req.body;
        const changes = req.body;
        if (!changes) {
            return sendErr(500, 'project_id of an existing project is required', res)
        }
        const id = await actionDb.insert({ project_id, description, notes });
        const action = await actionDb.get(id.id);
        res.status(200).json(action)
    } catch (err) {
        return sendErr(500, 'project could not be added', res)
    }
});

// edit action

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { description, notes } = req.body;
    const changes = req.body;
    actionDb
        .update(id, changes)
        .then(action => {
            action === 0 ?
                null :
                res.status(200).json(action)
        })
        .catch(err => {
            return sendErr(500, 'action could not be updated', res)
        });
});

// delete action

router.delete('/:id', (req, res) => {
    const { id } = req.params
    actionDb
        .remove(id)
        .then(count => {
            count === 0 ?
                sendErr(404, 'Id not found', res) :
                res.status(200).json(`${count} action has been removed`)
        })
        .catch(err => {
            return sendErr(500, 'action not deleted', res)
        });
})

module.exports = router;