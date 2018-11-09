const express = require('express');
const projectDb = require('../data/helpers/projectModel');

const router = express.Router();


const sendErr = (errCode, msg, res) => {
    res.status(errCode);
    res.json({ Error: msg })
};

// get data
router.get('/', (req, res) => {
    projectDb
        .get()
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            return sendErr(500, "projects not received", res)
        });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    projectDb
        .get(id)
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            return sendErr(500, "Id not found", res)
        });
});

router.get('/actions/:project_id', (req, res) => {
    const { project_id } = req.params;
    projectDb
        .getProjectActions(project_id)
        .then(project => {
            !project[0] ?
                sendErr(500, 'Project action not found', res) :
                res.status(200).json(project);
        })
        .catch(err => {
            return sendErr(500, 'nope', res)
        });
});

// add something

router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        const changes = req.body;
        const charLimit = 128;
        if (changes.name.length > charLimit){
        return sendErr(500, 'name must be less than 128 characters')
        }else if (!changes) {
            return sendErr(500, 'both name and description are required', res)
        } 
        const id = await projectDb.insert({ name, description });
        const project = await projectDb.get(id.id);
        res.status(200).json(project);
    } catch (err) {
        return sendErr(500, 'project could not be added', res);
    }
});

// update

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const changes = req.body;
    const charLimit = 128;
    
    projectDb
        .update(id, changes)
        .then(project => {
            project === 0 ?
                null :
                res.status(200).json(project);
        })
        .catch(err => {
            return sendErr(500, 'updated failed')
        });
});

// delete

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    projectDb
        .remove(id)
        .then(count => {
            count === 0 ?
                sendErr(500, 'nothing removed', res) :
                res.status(200).json(`${count} item has been removed`)
        })
        .catch(err => {
            return sendErr(500, 'delete failed')
        });
});

module.exports = router;