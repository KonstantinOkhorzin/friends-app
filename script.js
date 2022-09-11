'use strict'

let friendsFromServer;
let modifiedFriends;
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
    return data.results;
  } catch (error) {
    renderErrorMessage(message.failure, error)
  } finally {
    loading.remove();
  }
};


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
const renderFriendsCards = (friends) => {
  listFriends.innerHTML = '';
  friends.map((friend) => {
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


  searchInput.addEventListener('input', () => {
    searchInput.value = searchInput.value.replace(/[0-9]/g, '');
    let inputValue = searchInput.value.trim().toLowerCase();
    if (inputValue) {
      let modifiedFriends = friends.filter(friend => {
        const friendFullName = `${friend.name.first} ${friend.name.last}`.toLowerCase();
        return friendFullName.includes(inputValue);
      });
      btnIcon.src = svgReset;
      renderFriendsCards(modifiedFriends);
    } else {
      btnIcon.src = svgSearch;
      renderFriendsCards(friends)
    }

  });

  const resetSearchInput = (e) => {
    e.preventDefault();
    searchInput.value = '';
    btnIcon.src = svgSearch;
    renderFriendsCards(friends);
  };

  searchInputBtn.addEventListener('click', resetSearchInput);

}


function initApp() {
  getResourse(url).then(dataFromServer => {
    friendsFromServer = dataFromServer;
    // modifiedFriends = [...friendsFromServer];
    renderFriendsCards(dataFromServer);
    searchName(friendsFromServer);
  })

}

initApp();

