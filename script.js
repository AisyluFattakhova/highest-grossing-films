document.addEventListener('DOMContentLoaded', function () {
    const filmsContainer = document.getElementById('films-container');
    const sortSelect = document.getElementById('sort-select');
    const sortDirectionSelect = document.getElementById('sort-direction');
    const filterCriteriaSelect = document.getElementById('filter-criteria');
    const filterInput = document.getElementById('filter-input');

    let data = []; // Initialize an empty array to store the film data

    // Fetch the JSON file
    fetch('highest-grossing-films.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(films => {
            data = films; // Store the fetched data
            renderFilms(data); // Render the films
        })
        .catch(error => {
            console.error('Error loading the JSON file:', error);
        });

    // Render films based on the provided data
    function renderFilms(films) {
        filmsContainer.innerHTML = ''; // Clear the container
        films.forEach(film => {
            const filmCard = document.createElement('div');
            filmCard.className = 'film-card';
            filmCard.innerHTML = `
                <h2 class="film-title">${film.title}</h2>
                <p><strong>Year:</strong> ${film.release_year}</p>
                <p><strong>Director(s):</strong> ${film.director}</p>
                <p><strong>Box Office:</strong> ${film.box_office}</p>
                <p><strong>Country(ies):</strong> ${film.country}</p>
            `;
            filmsContainer.appendChild(filmCard);
        });

        // Add scroll-triggered animations
        const filmCards = document.querySelectorAll('.film-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing after animation
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the card is visible
        });

        filmCards.forEach(card => {
            observer.observe(card);
        });
    }

    // Sorting function
    function sortFilms(sortBy, sortDirection) {
        let sortedData = [...data]; // Create a copy of the original data

        switch (sortBy) {
            case 'title':
                sortedData.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'year':
                sortedData.sort((a, b) => a.release_year - b.release_year);
                break;
            case 'box_office':
                sortedData.sort((a, b) => {
                    const aBoxOffice = parseFloat(a.box_office.replace('$', '').replace(/,/g, ''));
                    const bBoxOffice = parseFloat(b.box_office.replace('$', '').replace(/,/g, ''));
                    return aBoxOffice - bBoxOffice;
                });
                break;
            default:
                break;
        }

        // Reverse the array for descending order
        if (sortDirection === 'desc') {
            sortedData.reverse();
        }

        renderFilms(sortedData);
    }

    // Filtering function
    function filterFilms(criteria, filterText) {
        const filteredData = data.filter(film => {
            switch (criteria) {
                case 'country':
                    return film.country.toLowerCase().includes(filterText.toLowerCase());
                case 'director':
                    return film.director.toLowerCase().includes(filterText.toLowerCase());
                case 'year':
                    return film.release_year.toString().includes(filterText);
                default:
                    return true; // No filtering
            }
        });
        renderFilms(filteredData);
    }

    // Event listeners for sorting and filtering
    sortSelect.addEventListener('change', () => {
        const sortBy = sortSelect.value;
        const sortDirection = sortDirectionSelect.value;
        sortFilms(sortBy, sortDirection);
    });

    sortDirectionSelect.addEventListener('change', () => {
        const sortBy = sortSelect.value;
        const sortDirection = sortDirectionSelect.value;
        sortFilms(sortBy, sortDirection);
    });

    filterCriteriaSelect.addEventListener('change', () => {
        filterInput.value = ''; // Clear the input when criteria changes
        renderFilms(data); // Reset to show all films
    });

    filterInput.addEventListener('input', (e) => {
        const criteria = filterCriteriaSelect.value;
        const filterText = e.target.value;
        filterFilms(criteria, filterText);
    });
});
