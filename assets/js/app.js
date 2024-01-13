let userForm = document.getElementById('userForm')
let title = document.getElementById('title')
let body = document.getElementById('body')
let userId = document.getElementById('userId')
const postContainer =document.getElementById('postContainer')
const sBtn = document.getElementById('sBtn')
const uBtn = document.getElementById('uBtn')


let baseurl = `https://fetch-b5233-default-rtdb.asia-southeast1.firebasedatabase.app/`;


let posturl = `${baseurl}/posts.json`;

const apicall = (apiUrl,methodName,msgbody=null)=>{
 return fetch(apiUrl,{
    method:methodName,
    body:msgbody,
    headers:{
        'Content-type':'application/json'
    }
  })
  .then(res=>{
    return res.json()
  })

}
apicall(posturl,'GET')
.then(data=>{
    console.log(data);
    let resobj = objToarr(data)
    console.log(resobj);
    templating(resobj)
  
})

const objToarr = (resobj)=>{
    let newobjArr =[];
 for(const key in resobj)
 {
    let obj = resobj[key];
    obj.id = key;
    newobjArr.push(obj);

 }
 return newobjArr
}


const createPostCards = (post) => {
    let card = document.createElement('div');
    card.className = 'card mb-4 mt-5';
    card.id = post.id;
    card.innerHTML = `
        <div class='card-header'>
            <h1 class='m-0'>${post.title}</h1>
        </div>
        <div class="card-body">
            <p class='m-0'>${post.body}</p>
        </div>
        <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-primary" onclick='onEdit(this)'>Edit</button>
            <button class="btn btn-danger" onclick='onDelete(this)'>Delete</button>
        </div>
      `
      postContainer.append(card);
  
    
}






const templating=(arr)=>{
 postContainer.innerHTML = ``
 arr.forEach(post=>{
    createPostCards(post)
 });
}

const onEdit=(ele)=>{
let editId =  ele.closest('.card').id;
localStorage.setItem('editId',editId)
let editUrl = `${baseurl}/posts/${editId}.json`;
apicall(editUrl,'GET')
.then(data=>{
    title.value = data.title,
    body.value = data.body,
    userId.value = data.userId
    sBtn.classList.add('d-none')
    uBtn.classList.remove('d-none')
    
    
})
.catch(err=>{
  console.log(err);
})
}

const onUpdate = ()=>{
    let onUpdateObj =
    {
       title : title.value,
       body : body.value,
       userId : userId.value
    }

    let updateId= localStorage.getItem('editId')
    let updateUrl = `${baseurl}/posts/${updateId}.json`
    apicall(updateUrl,'PATCH',JSON.stringify(onUpdateObj))
    .then(res=>{
        console.log(res);
        const card =[...document.getElementById(updateId).children]
        console.log(card);
        card[0].innerHTML =` <h1 class='m-0'>${res.title}</h1>`;
        card[1].innerHTML =` <p>${res.body}</p>`;
      })
      .catch(err=>{
        console.log(err);
      })
      .finally(()=>{
         userForm.reset();
         sBtn.classList.remove('d-none');
         uBtn.classList.add('d-none')
      })
    }
    
   const onDelete = (ele)=>{
     let deleteId  = ele.closest('.card').id;
     let deleteUrl = `${baseurl}/posts/${deleteId}.json`;
     let deleteData = confirm(`Are You Sure? Delete it!`)
     if(deleteData){

       apicall(deleteUrl,'DELETE')
       .then(del=>{
         console.log(del);
         const card = document.getElementById(deleteId)
         card.remove()
        })
        .catch(err=>{
          console.log(err);
        })
       
     }

   }


const onsubmit = (eve)=>{
 eve.preventDefault();
let newobj= 
{
  title: title.value,
  body:body.value,
  userId:userId.value
  
}
apicall(posturl,'POST',JSON.stringify(newobj))
.then(res=>{
  console.log(res);
  newobj.id = res.name;
   createPostCards(newobj)
  

  
})

.catch(err=>{
  console.log(err);
})
.finally(()=>{
  userForm.reset()
})
}


userForm.addEventListener('submit',onsubmit)
sBtn.addEventListener('click',onEdit)
uBtn.addEventListener('click',onUpdate)