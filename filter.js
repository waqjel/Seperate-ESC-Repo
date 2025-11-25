import { renderList } from './createcard.js';
import { fetchChallenges } from './api.js';


const allChallenges = await fetchChallenges();
const container = document.querySelector('#allChallenges');

renderList(container, allChallenges);

/* All variables from DOM */
const cbOnline = document.querySelector('.checkbox-online');
const cbOnsite = document.querySelector('.checkbox-onsite');
const textInput = document.querySelector('.search-input')
const filterBtn = document.querySelector('.filterBtn');
const filterInterface = document.querySelector('.filter-interface');
const closeBtn = document.querySelector('.close-btn');



/* Eventlisteners */
cbOnline.addEventListener('change', filter);
cbOnsite.addEventListener('change', filter);
textInput.addEventListener('input', filter);

filterBtn.addEventListener('click', () => {
    filterInterface.classList.add('active');
} );

closeBtn.addEventListener('click', () => {
    filterInterface.classList.remove('active');
} );

const filterTags = document.querySelectorAll('.filterTags');
const starMin = document.querySelectorAll('.rating .star-container:first-of-type .star');
const starMax = document.querySelectorAll('.rating .star-container:last-of-type .star');


let minRating = 0;
let maxRating = 5;


filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
        tag.classList.toggle('active');
        filter(); 
    });
});


starMin.forEach((star, index) => {
    star.addEventListener('click', () => {

          if (minRating === index + 1) {
            minRating = 0; 
            markStars(starMin, minRating);
            filter();
            return;
        }

        minRating = index + 1;
        markStars(starMin, minRating);
        filter();
    });
});

starMax.forEach((star, index) => {
    star.addEventListener('click', () => {

           if (maxRating === index + 1) {
            maxRating = 0;   
            markStars(starMax, maxRating);
            filter();
            return;
        }
        maxRating = index + 1;
        markStars(starMax, maxRating);
        filter();
    });
});

function markStars(stars, count) {
    stars.forEach((star, i) => {
        star.classList.toggle('active', i < count);
    });
}

function filter() {
    let filtered = allChallenges;
    const showOnline = cbOnline.checked;
    const showOnsite = cbOnsite.checked;
    const searchText = textInput.value.toLowerCase();
   
    /* Checkbox-filter */
    filtered = filtered.filter(challenge => {
        if (showOnline && !showOnsite) {
            return challenge.type === 'online';
        }
        if (!showOnline && showOnsite) {
            return challenge.type === 'onsite';
        }
        if (showOnline && showOnsite) {
            return true;
        }
        return true;
    });

    /* Text-filter */

    if (searchText) {
        filtered = filtered.filter(challenge => {
            const title = challenge.title.toLowerCase();
            const desc = challenge.description.toLowerCase();
            return title.includes(searchText) || desc.includes(searchText);}
        )};

    
    const activeTags = [];
    const activeElements = document.querySelectorAll('.filterTags.active');

    activeElements.forEach(tag => {
        activeTags.push(tag.dataset.tag);
    });

    if (activeTags.length > 0) {

        filtered = filtered.filter(challenge => {

           
            if (!challenge.labels || !Array.isArray(challenge.labels)) {
                return false;
            }

          
            for (let i = 0; i < activeTags.length; i++) {
                let tag = activeTags[i];

                if (!challenge.labels.includes(tag)) {
                    return false;
                }
            }

            return true;
        });
    }


    filtered = filtered.filter(challenge => {
        return challenge.rating >= minRating && challenge.rating <= maxRating;
    });

    renderList(container, filtered)

}





    


 
