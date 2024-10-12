'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});



///////////////////////////////////////
// Page navigation

document.querySelectorAll('.nav__link').forEach(function(el){
el.addEventListener('click',function(e){
  e.preventDefault();
  const id =this.getAttribute('href');
  console.log(id);
  document.querySelector(id).scrollIntoView({behavior:'smooth'});
})
});

// document.querySelector('.nav__links').addEventListener('click',function(e){
// e.preventDefault();
//   // Matching strategy
//   if(e.target.classList.contains('nav__link')){
//     const id =e.target.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior:'smooth'});

//   }
// });



///////////////////////////////////////
// Tabbed component

// "الدالة closest تبحث عن أقرب عنصر يطابق الصنف المحدد. في هذا الكود، عند النقر على عنصر ما داخل الحاوية، يتم تحديد أقرب عنصر يحتوي على الصنف .operations__tab. إذا لم يتم العثور على هذا العنصر، يتم إرجاع null ويتم إيقاف تنفيذ الكود بواسطة return."
// "The closest function searches for the nearest element that matches the specified selector. In this code, when clicking on an element within the container, the closest element with the class .operations__tab is selected. If no such element is found, null is returned, and the execution is stopped by return."



const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');


tabsContainer.addEventListener('click',function(e){
const clicked = e.target.closest('.operations__tab');
//console.log(clicked);
if(!clicked) return;
// Remove active classes
tabs.forEach(t=>t.classList.remove('operations__tab--active'));
tabsContent.forEach(c=>c.classList.remove('operations__content--active'));
// Activate tab
clicked.classList.add('operations__tab--active');
// Activate content area
document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');

});



///////////////////////////////////////
// Menu fade animation
const nav = document.querySelector('.nav');

const handleHover = function(opacity,e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('img');
    siblings.forEach(el=>{
      if(el!=link) el.style.opacity = opacity;
    });
    logo.style.opacity =opacity;
  }
};
// Passing "argument" into handler
nav.addEventListener('mouseover', (e)=>handleHover(0.5, e));
nav.addEventListener('mouseout', (e)=>handleHover(1, e));

// Another way 


// const nav = document.querySelector('.nav');

// const handleHover = function(e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('nav').querySelector('img');
//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = this;
//     });
//     logo.style.opacity = this;
//   }
// };

// تمرير القيمة باستخدام bind
// nav.addEventListener('mouseover', handleHover.bind(0.5));
// nav.addEventListener('mouseout', handleHover.bind(1));


///////////////////////////////////////
// Sticky navigation: Intersection Observer API

// [entry] هو أسلوب لفك تشفير مصفوفة entries
// حيث يتم تخزين أول عنصر من المصفوفة في المتغير entry
// هذا المتغير يحتوي على معلومات حول التقاطع مثل:
// entry.isIntersecting: تحدد ما إذا كان العنصر مرئيًا في نافذة العرض
// entry.boundingClientRect: يوفر إحداثيات العنصر
// entry.intersectionRatio: نسبة المساحة المشتركة بين العنصر ونافذة العرض



const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries){
  const [entry] = entries;
 // console.log(entry);
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav,{
root:null,
threshold:0,
rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections

const allSections = document.querySelectorAll('.section');
const revalSection = function(entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting)return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revalSection,{
  root:null,
  threshold:0.15,
});

allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
//Another way
// allSections.forEach(t=>{
//   sectionObserver.observe(t);
//   t.classList.add('section--hidden');
// });

// Lazy loading images

/*
  الفرق بين entry.target و e.target:

  - entry.target:
    - **السياق**: يستخدم في Intersection Observer.
    - **يشير إلى**: العنصر الذي يتم مراقبته.
    - **متى يُستخدم**: عندما يتقاطع العنصر مع منطقة الرؤية.

  - e.target:
    - **السياق**: يستخدم في أحداث DOM (مثل click).
    - **يشير إلى**: العنصر الذي تم تفعيل الحدث عليه.
    - **متى يُستخدم**: في دالة رد الفعل الخاصة بالحدث.
*/



const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries,observer){
  const [entry]= entries;
  if(!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
 
};

const imgObserver = new IntersectionObserver(loadImg,{
  root: null,
  threshold: 0,
  rootMargin: '200px',
  });
  imgTargets.forEach(img=>imgObserver.observe(img));

///////////////////////////////////////
// Slider

const slider = function(){
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let curSlide=0;
  const maxSlide = slides.length;

  // functions
  const createDots = function(){
    slides.forEach(function(_,i){
    dotContainer.insertAdjacentHTML('beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    )
    });
  };
  const activateDot = function(slide){
    document.querySelectorAll('.dots__dot').forEach(dot=>dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  
  const nextSlide = function(){
    if(curSlide === maxSlide - 1){
      curSlide = 0;
    }else{
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  }
  const prevSlide = function(){
    if(curSlide === 0){
      curSlide = maxSlide - 1;
    }else{
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  
  
  const init = function(){
    goToSlide(0);
    createDots();
  
    activateDot(0);
  };
  init();
  
    // Event handlers
  btnRight.addEventListener('click',nextSlide);
  btnLeft.addEventListener('click',prevSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
  
};
slider();























///////////////////////////////////////
// Styles, Attributes and Classes

// Styles




///////////////////////////////////////
// Types of Events and Event Handlers

// const h1 = document.querySelector('h1');
// const alertH1 = function(e){
//   alert('addEventListener: Great! You are reading the heading :D');
//   }
// h1.addEventListener('mouseenter',alertH1);
// setTimeout(()=>h1.removeEventListener('mouseenter',alertH1),3000);
// h1.onmouseenter = function(e){
//   alert('onmouseenter: Great! You are reading the heading :D');

// }

///////////////////////////////////////
// Event Propagation in Practice

const randomInt = (min,max)=>Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = ()=> `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;

// document.querySelector('.nav__link').addEventListener('click',function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('LINKS',e.target,e.currentTarget);
//   console.log(e.currentTarget === this);


//   // Stop propagation
//   //e.stopPropagation();


// });

// document.querySelector('.nav__links').addEventListener('click',function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER',e.target,e.currentTarget);


// });

// document.querySelector('.nav').addEventListener('click',function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('NAV',e.target,e.currentTarget);

// });

//Button Scrolling
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');
// btnScrollTo.addEventListener('click',function(e){
//   const s1coords = section1.getBoundingClientRect();
//   //Scrolling
//   // window.scrollTo(s1coords.left + window.pageXOffset,
//   //   s1coords.top + window.pageYOffset
//   // );
//   // window.scrollTo({
//   //  left: s1coords.left + window.pageXOffset,
//   //  top: s1coords.top + window.pageYOffset,
//   //  behavior:'smooth',
//   // });
//   section1.scrollIntoView({behavior:'smooth'});
// });




// document.querySelector('.nav__links').addEventListener('click',function(e){
//  console.log(e.target);

//  //Matching strategy
//  if(e.target.classList.contains('nav__link')){
//  // console.log('LINK');
//   e.preventDefault();
//   const id = e.target.getAttribute('href');
//   // console.log(id);
//   document.querySelector(id).scrollIntoView({
//     behavior:'smooth',
//   });
//  }
// });


///////////////////////////////////////

// DOM Traversing
// const h1 = document.querySelector('h1');

// // Going downwards: child

// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.lastElementChild.style.color = 'orangered';

// // Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background='var(--gradient-primary)';
// h1.closest('h1').style.background='var(--gradient-secondary)';

// // Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function(el){
//   if(el!==h1) el.style.transform = 'scale(0.5)';
//})

///////////////////////////////////////

// Sticky navigation باستخدام CSS:
// هذه الطريقة تستخدم الخاصية "position: sticky" في CSS لجعل شريط التنقل يبقى ثابتًا في أعلى الصفحة عند التمرير. 
// إنها بسيطة وسهلة الاستخدام لكنها لا توفر مرونة كبيرة في التفاعل مع أقسام الصفحة الأخرى.

// Sticky navigation باستخدام Intersection Observer API:
// تعتمد هذه الطريقة على JavaScript باستخدام Intersection Observer API لمراقبة متى يدخل أو يغادر عنصر معين نطاق رؤية المستخدم.
// توفر مرونة أكبر للتحكم في التثبيت بناءً على تفاعل المستخدم مع أقسام الصفحة


// Sticky navigation
// const section1 = document.querySelector('#section--1');
// const nav = document.querySelector('.nav');


// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll',function(){
//   //console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

 // Sticky navigation: Intersection Observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);



///////////////////////////////////////
// Lifecycle DOM Events

// document.addEventListener('DOMContentLoaded',function(e){
//   console.log('HTML parsed and DOM tree built!', e);
// });
// window.addEventListener('load',function(e){
//   console.log('Page fully loaded', e);

// });
// window.addEventListener('beforeunload',function(e){
//   e.preventDefault();
//   console.log(e);
//   e.returnValue ='';

// });


/**
 * scrollY يشير إلى التمرير العمودي (من الأعلى إلى الأسفل)، و
scrollX يشير إلى التمرير الأفقي (من اليسار إلى اليمين).

بكلمات بسيطة:

scrollY = التمرير العمودي.
scrollX = التمرير الأفقي.
 */