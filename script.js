'use strict'

const listFriends = document.querySelector('.list');
const styleList = {

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
            <div class="card__phone">${this.phone}</div>
        </li>`);
    }
};

const getResourse = async (url) => {
    const loading = document.createElement('div');
    loading.classList.add('status-message');
    loading.insertAdjacentHTML('afterbegin',
        `<img class='status-message__img' src=${message.loading} alt="">`);
    listFriends.before(loading);
    try {
        const result = await fetch(url);
        return await result.json();
    } catch (error) {
        renderErrorMessage(message.failure, error)
    } finally {
        loading.remove();
    }
};

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

const dataFriends = getResourse('https://randomuser.me/api/?results=100').then(data => {
    data.results.map((friend) => {
        const { cell } = friend;
        const { first, last } = friend.name;
        const src = friend.picture.large;
        const age = friend.dob.age;
        new FriendCard(src, first, last, age, cell, listFriends).render();
    });
});


const searchInput = document.querySelector('.search__input');
const searchBtn = document.querySelector('.search__btn');
const btnIcon = document.querySelector('.search__icon')
const svgSearch = 'img/search.svg';
const svgReset = 'img/reset.svg';

searchInput.addEventListener('input', () => {
    if (searchInput.value) {
        btnIcon.src = svgReset;
    } else {
        btnIcon.src = svgSearch;
    }
});

searchBtn.addEventListener('click', () => {
    searchInput.value = '';
    btnIcon.src = svgSearch;
});


const select = document.querySelector('.select');
const selectHeader = document.querySelector('.select__header');
const selectBody = document.querySelector('.select__body');

function selectToggle() {
    select.classList.toggle('select_active');
}

selectBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('select__item')) {
        selectHeader.innerHTML = `Sort by: ${e.target.innerHTML}`;
        select.classList.remove('select_active');
    };
});

selectHeader.addEventListener('click', selectToggle);


//Filter

const filterGender = document.querySelector('.filter-gender');
const filterGenderBtns = document.querySelectorAll('.filter-gender__btn');

filterGender.addEventListener('click', (e) => {
    filterGenderBtns.forEach(btn => btn.classList.remove('filter-gender__btn_active'));
    e.target.classList.add('filter-gender__btn_active');
    const targetGender = e.target.dataset.gender;

    switch (targetGender) {
        case 'all':
            return
        case 'male':
            return
        case 'female':
            return
    }
});



