import axios from 'axios'

export default {
	name: 'TaskList',
	data () {
    	return {
			userList: [],
			taskList: [],
			filteredList:[],
			currentTask: {id:"", name:"", price:0, user_id:"", time:0},
			sortDirection: true,
			filter: "",
			currentMode: 0,
			modifyed:false
		}
	 },

	 methods:
	 {
		findUser(id)
		{
			for(let i=0; i<this.userList.length; i++)
				if(this.userList[i].id==id)
					return this.userList[i];
			return(null)
		},

		filterList()
		{
     		if(this.filter=="")
        		this.filteredList=this.taskList;
    	  	else
				  this.filteredList=this.taskList.filter(task=>task.name.toLowerCase().indexOf(this.filter.toLowerCase())!=-1);

		},


		sortList()
		{
			if(this.sortDirection)
				this.filteredList.sort( function(task1, task2){return(task1.name>task2.name ? 1: -1)});
			else
			this.filteredList.sort( function(task1, task2){return(task1.name>task2.name ? -1: 1)});
		},


		editTask(task)
		{
			if(task)
				this.currentTask={id:task.id, name:task.name, price:task.price, user_id:task.user_id, time:task.time};
			else
				this.currentTask={id:"", name:"", price:0, user_id:"", time:0};
			this.currentMode=1;
		},


		updateTask()
		{
			if(this.currentTask.id=="")
				this.addNewTask()
			else
			{
				let task=null;
				for(let i=0; i<this.taskList.length; i++)
				{
					if(this.taskList[i].id==this.currentTask.id)
					{
						task=this.taskList[i];
						task.name=this.currentTask.name;
						task.price=this.currentTask.price;
						task.user_id=this.currentTask.user_id;
						task.time=this.currentTask.time;
					}
				}
			}
			this.modifyed=true;
			this.currentMode=0;
		},


		addNewTask()
		{
			this.taskList.push(this.currentTask);
			this.filteredList.push(this.currentTask);
			this.currentTask={id:"", name:"", price:0, user_id:"", time:0};
			this.currentMode=0;
		},

		cancelEdit()
		{
			this.currentTask={id:"", name:"", price:0, user_id:"", time:0};
			this.currentMode=0;
		},


		deleteTask(task)
		{
			if(!confirm('Действительно удалить запись?'))return;

			for(let i=0; i<this.taskList.length; i++)
				if(this.taskList[i]==task)
				{
					this.taskList.splice(i, 1);
					break;
				}

				for(let i=0; i<this.filteredList.length; i++)
				if(this.filteredList[i]==task)
				{
					this.filteredList.splice(i, 1);
					break;
				}
			this.modifyed=true;
		},


		sendToServer()
		{
			let data=JSON.stringify(this.taskList);

			let url="http://localhost";
			let ax=axios.create({baseURL:url});
			ax.post(url, data);
			this.modifyed=false;
		},


		checkAddButton()
		{
			return(this.currentTask.name!="" && this.currentTask.user_id!="" && this.currentTask.time>0);
		},

		checkSendButton()
		{
			return(this.modifyed)
		}
	 },

	 computed:
	 {
		totalTime()
		{
			let result=0;
			for(let i=0; i<this.filteredList.length; i++)
				result+=this.filteredList[i].time;
			return(result);
		},

		totalPrice()
		{
			let result=0;
			for(let i=0; i<this.filteredList.length; i++)
			{
				let task=this.filteredList[i];
				let user=this.findUser(task.user_id);
				result+=(task.time*user.price);
			}
			return(result);
		},
	 },

	 beforeMount()
	 {
		this.userList=[{id:'4F0C3B4C-D8D8-4F01-9D9D-03758936EC05', name:'Иванов', price:500}, {id:'A518B7DC-6BB2-4945-AC10-06A296660BDC', name:'Петров', price:250}, {id:'7B1D6B3F-F986-4E5A-92FD-0CB361140A23', name:'Сидоров', price:1000}];
		this.taskList=[{id:'CAACE86-37BC-454E-8FAF-0FEC73C69969', name:'Разработка сервера', user_id:'4F0C3B4C-D8D8-4F01-9D9D-03758936EC05', time:42}, {id:'A08E2244-E864-4304-BEDF-124D7A447135', name:'Разработка интерфейса', user_id:'A518B7DC-6BB2-4945-AC10-06A296660BDC', time:56}, {id:'143B5AB2-C63F-4D56-880C-126BC5DFAE4A', name:'написание инструкции', user_id:'A518B7DC-6BB2-4945-AC10-06A296660BDC', time:2.5}];
		this.filteredList=this.taskList.map(x=>x);
	 }
}
