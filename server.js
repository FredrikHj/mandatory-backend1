// Övning med routes     
const express = require('express');
const app = express();
const fileSystem = require('fs');
app.use(express.json());
const port = 3000;

let movieList = require('./express_JSON_API-RestAPI.json');

// Gets all movies =================================================
app.get('/Movie', (req, res) => {    
    res.send(movieList);
});
// Gets a specific movis
app.get('/Movie/:id', (req, res) => {
    let countItem = 0;
    let getItem;
    let idToNr = parseInt(req.params.id);

    console.log('Inkommande ID: '+ idToNr);
    
    // Get movie object
    movieList.data.find((obj, idx) => {
        countItem++;
        if (idToNr === countItem) {
            console.log('Item nr');
            getItem = movieList.data[idx];
            console.log(getItem);
            
        }      
    });

    console.log('Objekt visas');
    console.log(getItem);
    
    res.send(getItem);
});

// Create a new movie ===============================================
let countID = 0;
function createID() { 
    for (let index = 0; index < movieList.data.length; index++) {
        let idMax = movieList.data[index];
        countID = idMax.id;
    }
    // Get the last id in my arr of movies
    console.log('Id innan förändring');
    console.log(parseInt(countID));
    
    countID++;
    console.log('44');
    console.log(countID);
    
    return countID;
}
app.post('/Movie', (req, res) => {
    console.log('Ny post');

    let objForm = {
        id: JSON.stringify(createID()),
        name: req.body.name,
        rating: req.body.rating,
        genre: req.body.genre,
    };
    movieList.data.push(objForm);
    console.log(movieList);
    
    // Save the movies in an json file
   fileSystem.writeFile('express_JSON_API-RestAPI.json', JSON.stringify(movieList //debugging
     , null, 2
    ), function(err) {
       
        console.log(err);
        
    });
   
    res.send(movieList);
});
// Update a movie ================================================
app.put('/Movie/:id', (req, res) => {
    console.log('Uppdatera film: ');


    console.log('Inkommande ID: '+ parseInt(req.params.id));
   

    // Get movie object to update
    let updatedMovie = movieList.data.find((updateMovie) => {
        console.log('id');
        console.log(parseInt(updateMovie.id));

        if (parseInt(req.params.id) === parseInt(updateMovie.id)) {
            console.log('Update Item' + typeof parseInt(updateMovie.id));
            
            updateMovie.name = req.body.name;
            updateMovie.rating = req.body.rating;  
            updateMovie.genre = req.body.genre;  
            return updateMovie;
        }
    });
    // Save the movies in an json file
    fileSystem.writeFile('express_JSON_API-RestAPI.json', JSON.stringify(movieList //debugging
        , null, 2
        ), function(err) {
            if (err) {
                console.log(err);
                return;
            }            
    });
    res.status(200);
    res.send({data: updatedMovie});
});
// Delete a movie ================================================
app.delete('/Movie/:id', (req, res) => {
    console.log('Tabort film');
    let targetId = parseInt(req.params.id);
    
    // Verify if ID
    if (!targetId) {
        res.status(400).end();
        return;
    }
    let deldMovieIndex = movieList.data.findIndex(delMovie => parseInt(delMovie.id) === targetId);
    if (deldMovieIndex !== -1) {
        
        // Remove the item in the list
        movieList.data.splice(deldMovieIndex, 1);
    }
    
    
    // Save the movies in an json file
    fileSystem.writeFile('express_JSON_API-RestAPI.json', JSON.stringify(movieList //debugging
    , null, 2
    ), function(err) {
        if (err) {
            console.log(err);
            res.status(204);
            return;
        }
            
    });
        
    res.status(204).end();
});

 app.listen(port, () =>  console.log(`Example app listening on port ${port}!`));