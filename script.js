'use strict'

let friendsFromServer;
let modifiedFriends;
const url = 'https://randomuser.me/api/?results=24';
const listFriends = document.querySelector('.list');

const state = {
  search: '',
  filter: {
    gender: 'all',
    minAge: 0,
    maxAge: 0
  },
  sort: '',
};

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

function createFullName(firstName, lastName) {
  return `${firstName} ${lastName}`.toLowerCase();
}

function searchName(friends) {
  return friends.filter(friend => createFullName(friend.name.first, friend.name.last).includes(state.search));
}

function filterByGender(friends) {
  return friends.filter(friend => friend.gender === state.filter.gender);
}

function sortByName(friends) {
  friends.sort((a, b) => createFullName(a.name.first, a.name.last).localeCompare(createFullName(b.name.first, b.name.last)));
  return state.sort === 'a-z' ? friends : friends.reverse();
}

function sortByAge(friends) {
  friends.sort((a, b) => a.dob.age - b.dob.age);
  return state.sort === '1-9' ? friends : friends.reverse();
}

function bindEventListeners(friends) {
  const form = document.querySelector('.form');
  const resetForm = document.querySelector('.form__btn');

  form.addEventListener('input', ({ target: { name, value } }) => {
    if (name === 'search') {
      state.search = value;
    } else if (name === 'gender') {
      state.filter.gender = value;
    } else if (name === 'sort') {
      state.sort = value;
    }

    renderFriendsCards(getChosenFriends(friends));
  });

  resetForm.addEventListener('click', () => renderFriendsCards(friends))
}

function getChosenFriends(friends) {
  modifiedFriends = [...friends];

  if (state.search) {
    modifiedFriends = searchName(modifiedFriends);
  };
  if (state.filter.gender !== 'all') {
    modifiedFriends = filterByGender(modifiedFriends);
  };
  if (state.sort === '1-9' || state.sort === '9-1') {
    modifiedFriends = sortByAge(modifiedFriends);
  } else if (state.sort === 'a-z' || state.sort === 'z-a') {
    modifiedFriends = sortByName(modifiedFriends);
  }

  return modifiedFriends;
}

function friendsApp() {
  getResourse(url).then(dataFromServer => {
    friendsFromServer = [...dataFromServer];
    renderFriendsCards(dataFromServer);
    bindEventListeners(friendsFromServer);
  })
}

friendsApp();

