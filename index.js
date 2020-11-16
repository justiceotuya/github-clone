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

window.onLoad = handleLoadData()

async function handleLoadData() {
  document.querySelector('.loader').classList.remove('hidden')
  document.querySelector('.error').classList.add('hidden')
  const content = {
    "query": `{
    viewer {
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
      repositories(orderBy: {field: UPDATED_AT, direction: DESC}, first: 20, affiliations: OWNER) {
        totalCount
        nodes {
          createdAt
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
            'Authorization': "Bearer 88773cc15de3ced286c4737eb92211e082445044"
        },
        body: JSON.stringify(content)
    }

    try {
        const request = await fetch('https://api.github.com/graphql', options)
        const response = await request.json()
        await handleHandleDisplayUsersProfile(response.data.viewer)
        document.querySelector('.container').classList.remove('hidden')
        document.querySelector('.projects__navigation_tabs--desktop').classList.remove('hidden')
        document.querySelector('.loader').classList.add('hidden')
        document.querySelector('.error').classList.add('hidden')

        await handleWindowScrollInit()
    } catch (error) {
        console.log({ error })
        document.querySelector('.loader').classList.add('hidden')
        document.querySelector('.error').classList.remove('hidden')
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
repoCount.innerHTML = repositories.totalCount;

let repos = repositories.nodes.map(node => {
  // console.log(node)
  const {createdAt, description, forkCount, homepageUrl, id, isFork, licenseInfo, mirrorUrl, name, nameWithOwner, parent, primaryLanguage} = node
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
                      class="project__repo_updated_date"> ${handleFormatDate(createdAt)}</span>
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

function  handleWindowScrollInit () {
  window.addEventListener('scroll', function(e) {
    let profileImage = document.querySelector('.profile__image_user')
   if(this.scrollY > 364) {
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

window.addEventListener('click', function(e){
  if(e.target.classList.contains('header__repo_management') && repoLightBox.classList.contains('hidden') && profileLightBox.classList.contains('hidden')){
    repoLightBox.classList.remove('hidden')
  }
  else if(e.target.classList.contains('header__user_profile') && profileLightBox.classList.contains('hidden') && repoLightBox.classList.contains('hidden') ){
    profileLightBox.classList.remove('hidden')
  }
  else if(e.target.classList.contains('error__button')){
    handleLoadData();
  }  else{
    repoLightBox.classList.add('hidden')
    profileLightBox.classList.add('hidden')
  }
})
