'use strict'





//search
const searchInput = document.querySelector('.search__input');
const searchInputBtn = document.querySelector('.search__btn');
const btnIcon = document.querySelector('.search__icon')
const svgSearch = 'img/search.svg';
const svgReset = 'img/reset.svg';

searchInput.addEventListener('input', () => {
  searchInput.value  = searchInput.value.replace(/[0-9]/g, '');
  let inputValue = searchInput.value.trim().toLowerCase();
  if (inputValue) {
    btnIcon.src = svgReset;
  } else {
    btnIcon.src = svgSearch;
  }
});

const resetSearchInput = () => {
  searchInput.value = '';
  btnIcon.src = svgSearch;
};

searchInputBtn.addEventListener('click', resetSearchInput);


//Filter
const filterGender = document.querySelector('.filter-gender');

const filterByGender = (e) => {
  const targetGender = e.target.dataset.gender;
  let filterData;
  console.log(targetGender);
  if (targetGender === 'all') {
    return data
  } else {
    filterData = data.filter(friend => friend.gender === targetGender);
    console.log(filterData);
    renderFriendsCards(filterData);
  }

};
renderFriendsCards(data);

filterGender.addEventListener('click', filterByGender);

const inputsFilterAge = document.querySelectorAll('.filter-age__input');
console.log(inputsFilterAge[0].value);
const filterAge = () => {
  
  inputsFilterAge.forEach(input => {
    input.addEventListener('input', ({ target }) => {
      target.value  = target.value.replace(/\D/g, '');
      if(target.value.length > 2) {
        return;
      }
    });
  });
};

filterAge();


