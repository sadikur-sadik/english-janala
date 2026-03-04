function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
};
const createElements = (arr) => {
    let returnFunc;
    const htmlElements = arr.map((item) => `<span class="btn"> ${item}</span>`);
    
    returnFunc = htmlElements.length>0 ? htmlElements.join(" ") : 'No synonym';

    return returnFunc;
};

// // const manageSpinner = (status) => {
//     if(status === true){
//         document.querySelector('#spinner').classList.remove('hidden');
//         document.querySelector('#word-container').classList.add('hidden');

//     }
//     else{
//         document.querySelector('#spinner').classList.add('hidden');
//         document.querySelector('#word-container').classList.remove('hidden');

//     }
// }
const loadLessons = () => {

    const url = 'https://openapi.programming-hero.com/api/levels/all';

    fetch(url)
    .then(res => res.json())
    .then(json => displayLessions(json.data))
};

const removeActive = () => {
    const lessonButton = document.querySelectorAll('.lesson-btn');
    lessonButton.forEach(btn => {
        btn.classList.remove('bg-[#422AD5]','text-white')
    } )

}

const loadLevelWord = (id) => { //id from displayLessions
    // manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(res => res.json())
    .then(data =>{ 
        const clickBtn = document.querySelector(`#lesson-btn-${id}`);
        removeActive();
        clickBtn.classList.add('bg-[#422AD5]','text-white');
        displayLevelWord(data.data)});
        
};

const loadWordDetails = async(id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res =await fetch(url);
    const detais = await res.json();
    displayWordDetails(detais.data);

};

const displayWordDetails = (word) => {
    const detailsContainer = document.querySelector('#details-container');
    detailsContainer.innerHTML = `
     <div class="space-y-3">
                <h2 class="text-2xl font-bold">
                    ${word.word}(<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})
                </h2>
                <h2 class=" font-bold">
                    Meaning
                </h2>
                <p>${word.meaning}</p>
                <h2 class=" font-bold">
                    Example
                </h2>
                <p>${word.sentence}</p>
                <h2 class=" font-bold">
                    Synonym
                </h2>
                <div class="">${createElements(word.synonyms)}</div>
            </div>
    `;
    document.getElementById('my_modal_5').showModal();
    console.log(word.synonyms)
    
};

const displayLevelWord = (words) => {

    const wordContainer = document.querySelector('#word-container');
    wordContainer.innerHTML = '';
    
    if(words.length == 0){
         wordContainer.innerHTML = `
         <div class="text-center col-span-full space-y-2 font-bangla">
            <p class="text-red-400 text-[14px] font-[400px]">এখনে কোন Lesson নেই</p>
            <h2 class="text-red-600 text-[30px] font-medium">অন্য Lesson Select করুন।</h2>
        </div>`;
        // manageSpinner(false);
        return;
    };

    words.forEach(word => {

        const card = document.createElement('div');
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center md:py-10 py-4 md:px-5 px-1 md:space-y-4 space-y-2">
            <h2 class="font-bold text-2xl">${word.word ? word.word : 'No word'}</h2>
            <p class="font-semibold ">Meaning / Pronounciation</p>
            <div class="text-2xl font-bangla">${word.meaning ? word.meaning : 'No meaning'} / ${word.pronunciation ? word.pronunciation : 'No pronunciation'}</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1A91FF]/20 hover:bg-[#1A91FF]/10">
                    <i class="fa-solid fa-circle-info"></i>
                </button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF]/20 hover:bg-[#1A91FF]/10">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
        </div>
        `;
        wordContainer.appendChild(card);
        // manageSpinner(false);
    });}
const displayLessions = (lessons) => {

    const levelContainer =document.querySelector('#level-container');
    levelContainer.innerHTML = "";

    lessons.forEach(lesson => {
        
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" href="" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
            <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
        </button>
        `;

        levelContainer.appendChild(btnDiv);
    });
};




loadLessons();

document.querySelector("#btn-search").addEventListener("click",()=>{
    removeActive();
    const inputSearch = document.querySelector('#input-search');
    const searchValue = inputSearch.value.trim().toLowerCase();

    fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res => res.json())
    .then(data => {
        const allWords = data.data;
        const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
        displayLevelWord(filterWords);
    })
})