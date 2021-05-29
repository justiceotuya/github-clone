'use strict';
// toggle open and close state of header when hamburger is clicked
let hamburgerButton = document.querySelector('.header__hamburger');
let headerLinkSection = document.querySelector('.header__bottom');
hamburgerButton.addEventListener('click', function () {
    if (headerLinkSection.classList.contains('hidden')) {
        headerLinkSection.classList.remove('hidden')
    } else {
        headerLinkSection.classList.add('hidden')
    }
});

// window.onLoad = handleLoadData()

function handleClickSearchButton(event) {
  event.preventDefault();
  // get form value
  let value = document.querySelector('.search__input').value
  if(value !== "") {
    handleLoadData(value)
  }
}


async function handleLoadData(value) {
  //handles animation of the navbar
  handleWindowScrollInit()

  //handing loading and error screen
document.querySelector('.search__button').textContent = 'Loading'
document.querySelector('.search__button').disabled = true
  document.querySelector('.error').classList.add('hidden')
  document.querySelector('.empty').classList.add('hidden')

  const content = {
    "query": `{
    user(login: "${value}") {
      login
      avatarUrl(size: 460)
      bio
      email
      followers {
        totalCount
      }
      following {
        totalCount
      }
      starredRepositories {
        totalCount
      }
      name
       repositories( first: 20, orderBy:{field: PUSHED_AT, direction: DESC}) {
        totalCount
        nodes {
          createdAt
          updatedAt
          name
          description
          forkCount
          homepageUrl
          id
          licenseInfo {
            name
          }
          isFork
          primaryLanguage {
            color
            name
          }
          mirrorUrl
          nameWithOwner
          parent {
            nameWithOwner
            name
            resourcePath
            forkCount
          }
        }
      }
    }
  }`
}

    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer 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"
        },
        body: JSON.stringify(content)
    }  

  try {



        const request = await fetch('https://api.github.com/graphql', options)
    const response = await request.json()
    document.querySelector('.search__button').textContent = 'Search'
    document.querySelector('.search__button').disabled = false
  document.querySelector('.search').classList.add('hidden')
  document.querySelector('.search__button_toggler').classList.remove('hidden')
    if (!response.data.user) {
  document.querySelector('.empty').classList.remove('blur')
         document.querySelector('#profile__container').classList.add('hidden')
        document.querySelector('.empty').classList.remove('hidden')
      } else {
            await handleHandleDisplayUsersProfile(response.data.user)

        document.querySelector('#profile__container').classList.remove('hidden','blur')
//  document.querySelector('#profile__container').remove('blur')

      }



    } catch (error) {
        console.log({ error })
        //when there is an error, stop loading and show te error page
        document.querySelector('.error').classList.remove('blur',"hidden")
        document.querySelector('.search__loader_text').classList.add('hidden')
    }
}



//format the date for the updated repo
function handleFormatDate(date){
  let dateString = new Date(date).toDateString();
  let dateArray = dateString.split(" ")
  //remove the day from the date string
  dateArray.shift()
  let currentYear = new Date().getFullYear()
  if(dateArray[dateArray.length - 1] == currentYear){
    dateArray.pop()
  }
return dateArray.join(' ')
}

function handleHandleDisplayUsersProfile(data) {
const {avatarUrl, bio, email, followers, following, login, name,starredRepositories, repositories} = data

//set the images of the user profile
let images = document.querySelectorAll('[data-image]');
let userName = document.querySelectorAll('[data-username]');
let profileName = document.querySelector('.profile__name');
let profileLink = document.querySelectorAll('[data-user_link]');
let headerNav = document.querySelectorAll('.header');
let userEmail = document.querySelector('.profile__email');
let followersCount = document.querySelector('#followers_count');
let followingCount = document.querySelector('#following_count');
let starred = document.querySelector('#starred_count');
let repoCount = document.querySelector('.projects__repo_count');
let repoWrapper = document.querySelector('.project__repo_list_wrapper')

images.forEach(image => {
  image.setAttribute('src', avatarUrl)
  image.classList.remove('hidden')
})
headerNav.forEach(nav => {
  nav.classList.remove('hidden')
})
userName.forEach(image => image.innerHTML = login)
profileLink.forEach(profile => profile.innerHTML= bio)
profileName.innerHTML = name;
userEmail.innerHTML = email;
followersCount.innerHTML = followers.totalCount;
followingCount.innerHTML = following.totalCount;
starred.innerHTML = starredRepositories.totalCount;
  repoCount.textContent = repositories.totalCount;
  //delete child of node if it is present
   repoWrapper.innerHTML = '';

let repos = repositories.nodes.map(node => {
  const {updatedAt, description, forkCount, homepageUrl, id, isFork, licenseInfo, mirrorUrl, name, nameWithOwner, parent, primaryLanguage} = node
  let child =  ` <ul class="project__repo_list">
      <li class="project__repo">
          <div class="project__repo_info">
              <h2>
                  <a href="#" class="project__repo_name">
                      ${name}
                  </a>
              </h2>
             ${ parent ? `<p class="project__repo_forked_details">
                  Forked from <a
                  class="project__repo_forked_link"
                  href="#">${parent.nameWithOwner}</a>
              </p>`:""}

              ${ description ? `<p class="project__repo_description">
                  ${description}
                  </p>`:""}

           <div class="project__repo_meta">
           ${primaryLanguage ?  `<span class="project__repo_language">
                      <span class="project_repo_language_color" style="background-color:${primaryLanguage?.color || null}"></span>
                      <p class="project_repo_language_name">${primaryLanguage?.name}</p>
                  </span>`:""}

                   <span class="project__repo_forked">
                      <img src="./assets/images/fork.svg" alt="number of times forked">
                      <p class="project__repo_forked_number">
                      ${parent ? parent.forkCount : forkCount}
                      </p>
                  </span>

                  ${licenseInfo ?  `  <span class="project__repo_license">
                      <img src="./assets/images/law.svg" alt="number of times forked">
                          ${licenseInfo.name}
                  </span>`:""}

                  <span class="project__repo_updated">
                      Updated on <span
                      class="project__repo_updated_date"> ${handleFormatDate(updatedAt)}</span>
                  </span>
              </div>

          </div>
          <button class="project__repo_star_btn">
              <svg class="svg-star" height="16" viewBox="0 0 16 16" version="1.1" width="16"
                  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#6a737d">
                  <path fill-rule="evenodd" d="M8 .25a.75.75 0
01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719
4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0
01-1.088-.79l.72-4.194L.818 6.374a.75.75 0
01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0
01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084
2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0
01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8
2.694v.001z"></path>
              </svg>
              <span class="project__repo_star_btn_text"> Star</span>
          </button>
      </li>
  </ul>`


  repoWrapper.insertAdjacentHTML('beforeend', child)
})
}

//listen to windows scroll and hides/show element based of set breakpoint
function handleWindowScrollInit() {
  window.addEventListener('scroll', function (e) {
      let profileImage = document.querySelector('.profile__image_user')
   if(this.scrollY > 318) {
profileImage.classList.add("profile__image_user__show")
   }else {
    profileImage.classList.remove("profile__image_user__show")
   }
  })

}

// handle show lightbox list when the add repo item is clicked
let plusButton = document.querySelector('.header__repo_management')
let repoLightBox = document.querySelector('.header__repo_management_popup')
let profileButton = document.querySelector('.header__user_profile')
let profileLightBox = document.querySelector('.header__user_profile_popup')

//always listening to any click on the window. handles toggling of the
//information drop down on the right hand side of the nav bar
window.addEventListener('click', function(e){
  if(e.target.classList.contains('header__repo_management') && repoLightBox.classList.contains('hidden') && profileLightBox.classList.contains('hidden')){
    repoLightBox.classList.remove('hidden')
  }
  else if(e.target.classList.contains('header__user_profile') && profileLightBox.classList.contains('hidden') && repoLightBox.classList.contains('hidden') ){
    profileLightBox.classList.remove('hidden')
  }
  else if(e.target.classList.contains('error__button')){
    document.querySelector('.search').classList.toggle('hidden')
     document.querySelector('.error').classList.toggle('blur')
  }  else{
    repoLightBox.classList.add('hidden')
    profileLightBox.classList.add('hidden')
  }
})

function handleShowSearchForm() {
  document.querySelector('.search').classList.toggle('hidden')
  document.querySelector('#profile__container').classList.toggle('blur')
  document.querySelector('.error').classList.toggle('blur')
  document.querySelector('.empty').classList.toggle('blur')
}
