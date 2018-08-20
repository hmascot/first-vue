;
(function (Vue) {
	var app = new Vue({
        el: "#todoapp",
        data: {
            todos:[
                {
                    id:1,
                    title:"奔驰",
                    completed:true
                },
                {
                    id:2,
                    title:"宝马",
                    completed:false
                },
                {
                    id:3,
                    title:"夏利",
                    completed:true
                }
            ],
            currentItem:null,
            filterStat:"all"
        },
        
        computed: {
            leftNum() {
                return this.todos.filter(item => !item.completed).length;
            },
            filterTodos() {
                if(this.filterStat == "all") {
                    return this.todos;
                } else if(this.filterStat == "active") {
                    return this.todos.filter(item => item.completed);
                } else {
                    return this.todos.filter(item => !item.completed);
                }
            }
        },

        methods: {
            addTodo(event) {
                let lastTodo = this.todos[this.todos.length - 1];
                let id = lastTodo?lastTodo.id+1:1;
                let title = event.target.value.trim();
                if(title == "") {
                    return;
                }
                this.todos.push({
                    id,
                    title,
                    completed: false
                });
                event.target.value = "";
            },

            toggleAll(event) {
                let checked = event.target.checked;
                this.todos.forEach(function(item) {
                    return item.completed = checked;
                })
            },

            removeTodo(index,$event) {
                this.todos.splice(index,1);
            },

            removeAllCompleted() {
                this.todos = this.todos.filter(function(item) {
                    return !item.completed;
                })
            },
            saveEdit(item,index,event) {
                let checked = event.target.value.trim();
                console.log(checked)
                if(!checked.length) {
                    return this.todos.splice(index,1);
                    
                }
                
                item.value = checked;
                console.log(item.value)
                this.currentItem = null;
            }
        }
    });
    window.onhashchange = function(){
        // console.log(window.location.hash || "all");
        var hash = window.location.hash.substr(2) || "all";
        console.log(hash);
        app.filterStat = hash;
    }
    window.onhashchange();
})(Vue)
