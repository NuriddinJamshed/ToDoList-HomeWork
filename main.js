class ToDoList{
    constructor(api){
        this.api = api;
        this.right = document.querySelector(".right");
        this.inpSearch = document.querySelector(".inpSearch")
        this.selectStatus = document.querySelector(".selectStatus");
        this.addBtn = document.querySelector(".addBtn");
        this.addForm = document.querySelector(".addForm");
        this.addModal = document.querySelector(".addModal");
        this.closeBtn = document.querySelector(".close");
        this.cancelBtn = document.querySelector(".cancelBtn");
        this.editModal = document.querySelector(".editModal");
        this.editForm = document.querySelector(".editForm");
        this.cancelEdit = document.querySelector(".cancelEdit");
        this.closeEdit = document.querySelector(".closeEdit");
        this.idx = null;
        this.globalStatus = null;
        this.infoModal = document.querySelector(".infoModal");
        this.closeInfo = document.querySelector(".closeInfo");
        this.infoTitle = document.querySelector(".infoTitle");
        this.desInfo = document.querySelector(".info");
        this.get();

        //Events
        this.addForm.onsubmit=async(event)=>{
            event.preventDefault();
            let newCard = {
                title: this.addForm.addTitle.value,
                info: this.addForm.addInfo.value,
                status: false,
            }
            try {
                await fetch(this.api,{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newCard)
                })
                this.get();
                this.addForm.reset();
                this.addModal.close();
            } catch (error) {
                console.error(error);
            }
        }
        this.addBtn.onclick=()=>{
            this.addModal.showModal();
            this.addForm.reset();
        }
        
        this.cancelBtn.onclick=()=>{
            this.addModal.close();
            this.addForm.reset();
        }
        
        this.closeBtn.onclick=()=>{
            this.addModal.close();
        }
        
        this.cancelEdit.onclick=()=>{
            this.editModal.close();
            this.editForm.reset();
        }
        
        this.closeEdit.onclick=()=>{
            this.editModal.close();
        }
        this.closeInfo.onclick=()=>{
            this.infoModal.close();
        }
        this.editForm.onsubmit=async(event)=>{
            event.preventDefault();
            let updatedCard = {
                title: this.editForm.editTitle.value,
                info: this.editForm.editInfo.value,
                status: this.globalStatus,
                id: this.idx,
            }
            try {
                await fetch(`${this.api}/${this.idx}`,{
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedCard)
                });
                this.get();
                this.editModal.close();
            } catch (error) {
                console.error(error);
            }
        }
        this.inpSearch.oninput=()=>{
            this.search(this.inpSearch.value);
        }
        this.selectStatus.onchange=()=>{
            this.selStatus(this.selectStatus.value);
        }
    }
    async selStatus(value){
        if(value!="all"){
            try {
                let response = await fetch(`${this.api}?status=${value}`);
                let data = await response.json();
                this.getData(data);
            } catch (error) {
                console.error(error);
            }
        }else{
            this.get();
        }
    }
    async search(value){
        if(value){
            try {
                let response = await fetch(`${this.api}?title=${value}`);
                let data = await response.json();
                this.getData(data);
            } catch (error) {
                console.error(error);
            }
        }else{
            this.get();
        }
    }
    async get() {
        try {
            let response = await fetch(this.api);
            let data = await response.json();
            this.getData(data);
        } catch (error) {
            console.error(error);
        }
    }
    async deletCard(id) {
        try {
            await fetch(`${this.api}/${id}`, { method: 'DELETE' });
            this.get();
        } catch (error) {
            console.error(error);
        }
    }
    openEditModal(elem){
        this.editModal.showModal();
        this.idx = elem.id;
        this.editForm.editTitle.value = elem.title
        this.editForm.editInfo.value = elem.info
        this.globalStatus = elem.status;
    }
    async getById(id) {
        try {
            const response = await fetch(`${this.api}/${id}`);
            const data = await response.json();
            this.getElementById(data);
        } catch (err) {
            console.error(err);
        }
    }
    getElementById(elem) {
        this.infoModal.showModal();
        this.infoTitle.innerHTML = elem.title;
        this.desInfo.innerHTML = elem.info;
    }
    async updateStatus(elem){
        let changeStatus = {
            ...elem,
            status:!elem.status,
        }
        try {
            await fetch(`${this.api}/${elem.id}`,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(changeStatus)
            })
            this.get();
        } catch (error) {
            console.error(error);
        }
    }
    getData(data){
        this.right.innerHTML = "";
        data.forEach((el)=>{
            let card = document.createElement("div");
            card.className = "card";
            if(el.status){
                card.style.backgroundColor = "#fd9e9e";
                card.style.textDecoration = "line-through";
            }else{
                card.style.backgroundColor = "#ffeecf";
                card.style.textDecoration = "none";
            }
            let title = document.createElement("h2");
            title.classList.add("title");
            title.innerHTML = el.title;
            let info = document.createElement("p");
            info.classList.add("info");
            info.innerHTML = el.info;
            let actions = document.createElement("div");
            actions.classList.add("actions");
            
            let edit = document.createElement("span");
            edit.classList.add("edit");
            edit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>';
            edit.onclick=()=>{
                this.openEditModal(el);
            }
    
            let delet = document.createElement("span")
            delet.classList.add("delete");
            delet.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>';
            delet.onclick=()=>{
                this.deletCard(el.id);
            }
    
            let check = document.createElement("input");
            check.classList.add("check");
            check.type = "checkbox";
            check.checked = el.status;
            check.onchange=()=>{
                this.updateStatus(el);
            }
    
            let infoBtn = document.createElement("span")
            infoBtn.classList.add("info-btn");
            infoBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>';
            infoBtn.onclick=()=>{
                this.getById(el.id)
            }
            
            let mainActions = document.createElement('div');
            mainActions.classList.add('main-actions');
            mainActions.append(edit, delet, infoBtn);
    
            let done = document.createElement("span");
            done.classList.add("done");
            done.innerHTML = 'Done';
    
            actions.append(mainActions, check, done);
            card.append(title, info, actions);
            this.right.append(card);
        })
    }
}

new ToDoList ("https://67d56e61d2c7857431f060a7.mockapi.io/api/v1/dataUsers")