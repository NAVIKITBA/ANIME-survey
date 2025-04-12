// Function to transition to the next form
function goToNextForm() {
    const selectedGenres = Array.from(document.querySelectorAll('#genres input:checked'));
    if (selectedGenres.length > 3) {
        alert('Please select up to 3 genres.');
        return;
    }

    document.getElementById('form1').style.display = 'none';
    document.getElementById('form2').style.display = 'block';
}

// Function to show the survey introduction popup
// Function to transition to the next form
function showSurveyIntroduction() {
    console.log('Forcing survey popup display.');

    const popup = document.createElement('div');
    popup.id = 'surveyPopup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.width = '80%';
    popup.style.maxWidth = '600px';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    popup.style.color = 'white';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.padding = '20px';
    popup.style.textAlign = 'center';
    popup.style.zIndex = '1000';
    popup.style.opacity = '0';
    popup.style.transition = 'opacity 0.3s ease-in-out';

    // Fade-in effect
    setTimeout(() => {
        popup.style.opacity = '1';
    }, 10);

    popup.innerHTML = `
        <h1>PLEASE READ</h1>
        <p>Hello, this is the researcher. For the sake of anonymity I will be asking for a pseudonym. This survey will have 2 sections:</p>
        <p>(1) UGT - why you watch anime and what you get from it;</p>
        <p>(2) MBTI - questions will be asked to see whether there's a correlation between the anime genres you watch and your personality type.</p>
        <p>For the sake of consistency, do make sure to be honest. At the end you will see what your personality type is.</p>
        <p>This will only take up to 5-10 minutes of your time. Thank you!</p>
        <button id="gotItBtn" style="margin-top: 20px; padding: 10px 20px; background-color: green; color: white; border: none; border-radius: 5px; cursor: pointer;">Got it!</button>
    `;

    // Append to the placeholder container or body
    const container = document.getElementById('popupContainer');
    if (container) {
        container.appendChild(popup);
        console.log('Popup appended to container.');
    } else {
        console.error('Popup container not found. Forcing popup to body.');
        document.body.appendChild(popup); // Force append to body if container is missing
    }

    // Add event listener to the "Got it!" button
    const gotItBtn = document.getElementById('gotItBtn');
    if (gotItBtn) {
        gotItBtn.addEventListener('click', closeSurveyPopup);
    }
}

// Function to close the survey introduction popup
function closeSurveyPopup() {
    const popup = document.getElementById('surveyPopup');
    if (popup) {
        popup.style.opacity = '0'; // Fade-out effect
        setTimeout(() => {
            popup.remove();
        }, 300); // Wait for the fade-out transition to complete
        console.log('Popup dismissed.');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[name="genre"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const selected = Array.from(checkboxes).filter(c => c.checked);
            if (selected.length > 3) {
                checkbox.checked = false;
                alert('You can only select up to 3 genres.');
            }
        });
    });

    const nextButton = document.querySelector('#nextButton');
    nextButton.addEventListener('click', () => {
        const selectedGenres = getSelectedGenres();

        if (selectedGenres.length === 0) {
            alert('Please select at least one genre.');
            return;
        }
   
        if (selectedGenres.length > 3) {
            alert('You can only select up to 3 genres.');
            return;
        }

        // Hide all genre forms initially
        const genreForms = document.querySelectorAll('.genre-form');
        genreForms.forEach(form => form.style.display = 'none');

        // Show forms for selected genres
        selectedGenres.forEach(genre => {
            const genreForm = document.getElementById(`${genre}-Genre`);
            if (genreForm) {
                genreForm.style.display = 'block';

                // Display the genre name in the questions part
                const genreTitle = genreForm.querySelector('.genre-title');
                if (genreTitle) {
                    genreTitle.textContent = `Questions for ${genre}`;
                }
            }
        });

        // Display the names of the selected genres with their corresponding forms
        const genreNamesContainer = document.getElementById('selectedGenreNames');
        if (genreNamesContainer) {
            genreNamesContainer.innerHTML = ''; // Clear previous names
            selectedGenres.forEach(genre => {
                const genreName = document.createElement('p');
                genreName.textContent = genre; // Display the genre name directly
                genreNamesContainer.appendChild(genreName);
            });
        }

        // Transition to the survey questions section
        document.getElementById('genreSelection').style.display = 'none';
        document.getElementById('survey-questions').style.display = 'block';
    });

    styleAnswerQuestionsSection();
});

function getSelectedGenres() {
    const selected = Array.from(document.querySelectorAll('input[name="genre"]:checked')).map(cb => cb.value);
    return selected;
}

// Updated submitSurvey to include genres
function submitSurvey() {
    try {
        const infoForm = new FormData(document.getElementById('infoForm'));
        const ugtForm = new FormData(document.getElementById('ugtForm'));

        const data = {
            pseudonym: '',
            age: '',
            email: '',
            watchFrequency: '',
            yearLevel: '',
            Gender: '',
            UGT_Questions: '',
            GenreSelection: '',
            MBTI_Action: '',
            MBTI_Adventure: '',
            MBTI_Comedy: '',
            MBTI_Drama: '',
            MBTI_Fantasy: '',
            MBTI_Horror: '',
            MBTI_Romance: '',
            MBTI_SciFi: '', 
            txtQuestions: '', 
            MBTI_Results: '' 
        };

        
        infoForm.forEach((value, key) => {
            if (key === 'gender') {
                data['Gender'] = value; 
            } else {
                data[key] = value;
            }
        });

       
        const ugtData = [];
        ugtForm.forEach((value, key) => {
            if (key.startsWith('question')) {
                ugtData.push(`${key.toUpperCase()}=${value}`);
            }
        });
        data['UGT_Questions'] = ugtData.join(' ');

        
        const selectedGenres = getSelectedGenres();
        if (selectedGenres.length > 0) {
            data['GenreSelection'] = selectedGenres.join(', ');

            
            selectedGenres.forEach(genre => {
                const genreForm = document.getElementById(`${genre}-Genre`);
                if (genreForm) {
                    const genreFormData = new FormData(genreForm);
                    const mbtiData = [];
                    genreFormData.forEach((value, key) => {
                        mbtiData.push(`${key}=${value}`);
                    });
                    data[`MBTI_${genre}`] = mbtiData.join(' ');
                }
            });

            
            if (selectedGenres.includes('Sci-Fi')) {
                const sciFiForm = document.getElementById('SciFi-Genre');
                if (sciFiForm) {
                    const sciFiFormData = new FormData(sciFiForm);
                    const sciFiData = [];
                    sciFiFormData.forEach((value, key) => {
                        sciFiData.push(`${key}=${value}`);
                    });
                    data['MBTI_SciFi'] = sciFiData.join(' '); // Save Sci-Fi data
                }
            }
        }

        
        const textQuestionsSection = document.getElementById('textQuestionsSection');
        if (textQuestionsSection) {
            const textInputs = textQuestionsSection.querySelectorAll('textarea, input[type="text"]');
            const textData = [];
            textInputs.forEach(input => {
                if (input.name && input.value) {
                    textData.push(`${input.name}=${input.value}`);
                }
            });
            data['txtQuestions'] = textData.join(' '); // Save text questions data
        }

        
        const mbtiResult = calculateMBTIPersonality();
        data['MBTI_Results'] = `${mbtiResult.personalityType} - ${mbtiResult.description}`; // Save MBTI result

        /
        if (!data.pseudonym || !data.age || !data.email || !data.watchFrequency || !data.yearLevel || !data.Gender) {
            alert('Please fill out all required fields in the Information Table.');
            return;
        }

        if (!data.UGT_Questions) {
            alert('Please answer all UGT questions.');
            return;
        }

        if (!data.GenreSelection) {
            alert('Please select at least one genre.');
            return;
        }

        
        fetch('https://sheetdb.io/api/v1/1ojx9z1slwmk1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data }) 
        }).then(response => {
            if (response.ok) {
                
                document.body.innerHTML = `
                    <div style="text-align: center; margin-top: 50px;">
                        <h1>Thank You for Completing the Survey!</h1>
                        <img src="https://gifdb.com/images/thumbnail/kazuma-sato-thank-you-anime-funny-dance-vaqdl5j1387ekr0x.gif" alt="Thank You" style="max-width: 100%; height: auto;">
                    </div>
                `;

                
                setTimeout(() => {
                    showMBTIPopup(mbtiResult.personalityType, mbtiResult.description);
                }, 500);
            } else {
                response.json().then(errorData => {
                    console.error('Error response from server:', errorData);
                    alert('Failed to submit survey. Please try again.');
                });
            }
        }).catch(error => {
            console.error('Error submitting survey:', error);
            alert('An error occurred while submitting the survey. Please try again.');
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

function showMBTIPopup(personalityType, description) {
    
    const popup = document.createElement('div');
    popup.id = 'mbtiPopup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.width = '80%';
    popup.style.maxWidth = '500px';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; 
    popup.style.color = 'white';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.padding = '20px';
    popup.style.textAlign = 'center';
    popup.style.zIndex = '1000';
    popup.style.opacity = '0';
    popup.style.animation = 'fadeIn 0.5s forwards'; // Fade-in animation

    
    popup.innerHTML = `
        <h2>Your MBTI Personality</h2>
        <p><strong>${personalityType}</strong></p>
        <p>${description}</p>
        <button id="closePopupBtn" style="margin-top: 20px; padding: 10px 20px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
    `;

    
    document.body.appendChild(popup);

    
    const closePopupBtn = document.getElementById('closePopupBtn');
    closePopupBtn.addEventListener('click', () => {
        popup.style.animation = 'fadeOut 0.5s forwards'; 
        setTimeout(() => {
            popup.remove();
        }, 500); 
    });

    
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }

        @keyframes fadeOut {
            from { opacity: 1; transform: translate(-50%, -50%); }
            to { opacity: 0; transform: translate(-50%, -60%); }
        }
    `;
    document.head.appendChild(style);
}


function displaySelectedGenres(selectedGenres) {
    const genreNamesContainer = document.getElementById('selectedGenreNames');
    if (genreNamesContainer) {
        genreNamesContainer.innerHTML = ''; 
        selectedGenres.forEach(genre => {
            const genreName = document.createElement('p');
            genreName.textContent = genre; 
            genreName.style.margin = '10px 0'; 
            genreName.style.textAlign = 'center'; 
            genreNamesContainer.appendChild(genreName);
        });

        
        const nextButton = document.querySelector('#nextButton');
        if (nextButton && nextButton.parentNode) {
            nextButton.parentNode.appendChild(genreNamesContainer);
        }
    } else {
        console.error('Selected genre names container not found.');
    }
}


function showScrollDownPopup() {
    const popup = document.createElement('div');
    popup.id = 'scrollDownPopup';
    popup.textContent = 'Please scroll down';
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.color = 'white';
    popup.style.padding = '10px 20px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '1000';
    popup.style.fontSize = '16px';
    popup.style.textAlign = 'center';

    document.body.appendChild(popup);

    
    setTimeout(() => {
        popup.remove();
    }, 5000);
}


function goToNextPage() {
    const selectedGenres = Array.from(document.querySelectorAll('input[name="genre"]:checked')).map(cb => cb.value);

    if (selectedGenres.length === 0) {
        alert('Please select at least one genre.');
        return;
    }

    if (selectedGenres.length > 3) {
        alert('You can only select up to 3 genres.');
        return;
    }

    
    document.getElementById('genreSelection').style.display = 'none';

    
    document.getElementById('survey-questions').style.display = 'block';

    
    const genreForms = document.querySelectorAll('form[id$="-Genre"]');
    genreForms.forEach(form => form.style.display = 'none');

    
    selectedGenres.forEach(genre => {
        const genreForm = document.getElementById(`${genre}-Genre`);
        if (genreForm) {
            genreForm.style.display = 'block';

            
            const genreTitle = genreForm.querySelector('.genre-title');
            if (genreTitle) {
                genreTitle.textContent = `Questions for ${genre}`; 
            } else {
                console.warn(`Genre title element not found for genre: ${genre}`);
            }
        } else {
            console.error(`Form for genre "${genre}" not found.`);
        }
    });

    
    displaySelectedGenres(selectedGenres);

    
    if (selectedGenres.includes('Sci-Fi')) {
        const sciFiForm = document.getElementById('SciFi-Genre');
        if (sciFiForm) {
            sciFiForm.style.display = 'block';
            console.log('Explicitly displaying Sci-Fi genre form.');
        } else {
            console.error('Sci-Fi genre form not found.');
        }
    }

    
    showScrollDownPopup();
}


function styleAnswerQuestionsSection() {
    const answerQuestionsSection = document.querySelector('#survey-questions');
    if (answerQuestionsSection) {
        answerQuestionsSection.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        answerQuestionsSection.style.color = '#333';
        answerQuestionsSection.style.borderRadius = '10px';
        answerQuestionsSection.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        answerQuestionsSection.style.padding = '30px';
        answerQuestionsSection.style.margin = '40px auto';
        answerQuestionsSection.style.width = '70%';
        answerQuestionsSection.style.maxWidth = '800px';
        answerQuestionsSection.style.textAlign = 'center'; 
        answerQuestionsSection.style.fontFamily = 'Arial, sans-serif';
        answerQuestionsSection.style.lineHeight = '1.6';
        answerQuestionsSection.style.display = 'flex'; 
        answerQuestionsSection.style.flexDirection = 'column';
        answerQuestionsSection.style.alignItems = 'center';
        answerQuestionsSection.style.justifyContent = 'center';
    } else {
        console.error('Answer the Questions section not found.');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[name="genre"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const selected = Array.from(checkboxes).filter(c => c.checked);
            if (selected.length > 3) {
                checkbox.checked = false;
                alert('You can only select up to 3 genres.');
            }
        });
    });

    const nextButton = document.querySelector('#nextButton');
    nextButton.addEventListener('click', () => {
        const selectedGenres = getSelectedGenres();

        if (selectedGenres.length === 0) {
            alert('Please select at least one genre.');
            return;
        }
   
        if (selectedGenres.length > 3) {
            alert('You can only select up to 3 genres.');
            return;
        }

        
        const genreForms = document.querySelectorAll('.genre-form');
        genreForms.forEach(form => form.style.display = 'none');

        
        selectedGenres.forEach(genre => {
            const genreForm = document.getElementById(`${genre}-Genre`);
            if (genreForm) {
                genreForm.style.display = 'block';

                
                const genreTitle = genreForm.querySelector('.genre-title');
                if (genreTitle) {
                    genreTitle.textContent = `Questions for ${genre}`;
                }
            }
        });

        
        const genreNamesContainer = document.getElementById('selectedGenreNames');
        if (genreNamesContainer) {
            genreNamesContainer.innerHTML = ''; 
            selectedGenres.forEach(genre => {
                const genreName = document.createElement('p');
                genreName.textContent = genre; 
                genreNamesContainer.appendChild(genreName);
            });
        }

        
        document.getElementById('genreSelection').style.display = 'none';
        document.getElementById('survey-questions').style.display = 'block';
    });

    styleAnswerQuestionsSection();
});

function calculateMBTIPersonality() {
    const traits = {
        E: 0,
        I: 0,
        S: 0,
        N: 0,
        T: 0,
        F: 0,
        J: 0,
        P: 0
    };

    
    const surveySection = document.getElementById('survey-questions');
    const inputs = surveySection.querySelectorAll('input[type="radio"]:checked');

    // Count the selected answers
    inputs.forEach(input => {
        const value = input.value;
        if (traits.hasOwnProperty(value)) {
            traits[value]++;
        }
    });

    
    const personality = `${traits.E >= traits.I ? 'E' : 'I'}${traits.S >= traits.N ? 'S' : 'N'}${traits.T >= traits.F ? 'T' : 'F'}${traits.J >= traits.P ? 'J' : 'P'}`;

    
    const personalityDescriptions = {
        "ESTJ": "ESTJ - The Organized: Logical, organized, and assertive. You like to manage and make decisions.",
        "ESFJ": "ESFJ - The Supporter: Warm, empathetic, and cooperative. You value harmony and relationships.",
        "ENTJ": "ENTJ - The Planner: Decisive, strategic, and leadership-driven. You enjoy planning and taking charge.",
        "ENFJ": "ENFJ - The One: Charismatic, inspiring, and empathetic. You seek to help others grow.",
        "ISTJ": "ISTJ - The Reliable One: Practical, responsible, and detail-oriented. You prefer structure and reliability.",
        "ISFJ": "ISFJ - The Keeper: Caring, supportive, and loyal. You prioritize helping others and maintaining stability.",
        "INTJ": "INTJ - The Architect: Innovative, independent, and strategic. You focus on long-term goals and improvements.",
        "INFJ": "INFJ - The Listener: Insightful, compassionate, and principled. You are driven by a deep sense of purpose.",
        "ESTP": "ESTP - The Hands-on Doer: Energetic, bold, and action-oriented. You enjoy new experiences and challenges.",
        "ESFP": "ESFP - The People Person: Fun-loving, spontaneous, and social. You seek excitement and enjoy living in the moment.",
        "ENTP": "ENTP - The Debater: Inventive, curious, and quick-witted. You enjoy engaging in challenging intellectual discussions.",
        "ENFP": "ENFP - The Optimist: Enthusiastic, creative, and idealistic. You value individuality and authenticity.",
        "ISTP": "ISTP - The Practical One: Adventurous, practical, and skilled. You like to solve problems with hands-on approaches.",
        "ISFP": "ISFP - The Independent: Artistic, sensitive, and independent. You value personal expression and aesthetic beauty.",
        "INTP": "INTP - The Thinker: Analytical, curious, and theoretical. You enjoy solving complex problems and exploring new ideas.",
        "INFP": "INFP - The Idealist: Empathetic, idealistic, and introspective. You seek deep meaning and personal growth."
    };

    
    return {
        personalityType: personality,
        description: personalityDescriptions[personality] || "Personality description not found."
    };
}
const result = calculateMBTIPersonality();
console.log(result.personalityType); 
console.log(result.description); 
