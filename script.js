'use strict'

let friends = [];
const url = 'https://randomuser.me/api/?results=10';
const listFriends = document.querySelector('.list');

//getResourse
const message = {
  loading: 'img/spinner.svg',
  failure: 'Failed to connect with the server! Please try later'
};

const renderErrorMessage = (message, error) => {
  listFriends.insertAdjacentHTML("beforebegin", `
        <div class="status-message">
            <div class="status-message__title">${message}</div>
            <div class="status-message__descr">${error}</div>
        </div>
    `);
};

const getResourse = async (url) => {

  const loading = document.createElement('div');
  loading.classList.add('status-message');
  loading.insertAdjacentHTML('afterbegin',
    `<img class='status-message__img' src=${message.loading} alt="">`);
  listFriends.before(loading);

  try {
    const response = await fetch(url);
    const data = await response.json();
    return handleFetchedFriends(data.results);
  } catch (error) {
    renderErrorMessage(message.failure, error)
  } finally {
    loading.remove();
  }
};

function handleFetchedFriends(fetchedFriends) {
  friends = fetchedFriends;
  renderFriendsCards(fetchedFriends);
}

//Card
class FriendCard {
  constructor(imgSrc, firstName, lastName, age, phone, parentElement) {
    this.imgSrc = imgSrc;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.phone = phone;
    this.name = `${this.firstName} ${this.lastName}`;
    this.parent = parentElement;
  }
  render() {
    this.parent.insertAdjacentHTML('beforeend', `
        <li class="card">
            <img class="card__img" src=${this.imgSrc} alt="">
            <div class="card__name">${this.name}</div>
            <div class="card__age">${this.age} years old</div>
            <a class="card__phone" href="tel:${this.phone}">${this.phone}</a>
        </li>`);
  }
};

//render cards
const renderFriendsCards = (data) => {
  data.map((friend) => {
    const { cell } = friend;
    const { first, last } = friend.name;
    const src = friend.picture.large;
    const age = friend.dob.age;
    new FriendCard(src, first, last, age, cell, listFriends).render();
  });
};


//search
function searchName(friends) {
  const searchInput = document.querySelector('.search__input');
  const searchInputBtn = document.querySelector('.search__btn');
  const btnIcon = document.querySelector('.search__icon')
  const svgSearch = 'img/search.svg';
  const svgReset = 'img/reset.svg';
  let searchFriends;

  searchInput.addEventListener('input', () => {
    searchInput.value  = searchInput.value.replace(/[0-9]/g, '');
    let inputValue = searchInput.value.trim().toLowerCase();
    if (inputValue) {
      searchFriends = friends.filter(friend => {
        const friendName = `${friend.name.first} ${friend.name.last}`;
        friendName.toLowerCase().includes(inputValue);
      });
      btnIcon.src = svgReset;
    } else {
      btnIcon.src = svgSearch;
    }
  });
  
  const resetSearchInput = (e) => {
    e.preventDefault();
    searchInput.value = '';
    btnIcon.src = svgSearch;
    renderFriendsCards(friends);
  };
  
  
  searchInputBtn.addEventListener('click', resetSearchInput);
  renderFriendsCards(searchFriends);
}

function initApp() {
  getResourse(url);
  searchName(friends);
}

initApp();

