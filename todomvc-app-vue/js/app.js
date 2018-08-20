(function (Vue) {
	'use strict';
    // 注册一个全局自定义指令‘v-focus’
    Vue.directive('focus', {
        inserted:function(el) {
            console.log(el);
            el.focus();
        }
    })
	// Your starting point. Enjoy the ride!
	var app =window.app= new Vue({
        el: '#todoapp',
		data: {
			seen: true,
			currentItem: null,
            filterStat: "all",
            // toggleStat:true,
			// todos: [
            //     {
			// 		id: 1,
			// 		title: '早上好',
			// 		completed: true
			// 	},
			// 	{
			// 		id: 2,
			// 		title: '中午好',
			// 		completed: false
			// 	},
			// 	{
			// 		id: 3,
			// 		title: '晚上好',
			// 		completed: true
			// 	}
            // ]
            // 从本地读取数据  字符串-----------》数组  JSON.parse()
            todos:JSON.parse(window.localStorage.getItem("addTodo") || "[]")
        },
        /**
         * 计算属性确实有watch的功能，但是计算属性一般用于需要返回数据的功能
         * watch一般用于定义自己的业务功能，他不是让你去模板绑定，
         *      纯粹让你监视这个成员改变，可以自定义一些业务功能
         */
        watch: {
            // 监视todos
            // watch默认只监视一层，我们需要让其深度监视
            // deep:true 深度监视 ，但是要采用对象的形式
            todos: {
                handler:function(newVal,oldVal) {
                // console.log(this.todos);
                 // 本地存储 存储的是"字符串"
                 window.localStorage.setItem("addTodo",JSON.stringify(newVal));
                 
            },
            deep:true
        }
        },
		computed: {
            toggleAllStat() {
                return this.todos.every(item => item.completed)
            },
			// 定义计算属性 leftNum本质上是一个函数
			leftNum() {
				return this.todos.filter(item => !item.completed).length;
			},
			/*
                all 返回所有的todos
                active 返回所有未完成（completed=false）
                completed 返回所有完成（completed=true）
            */
			filterTodos: function () {
				if (this.filterStat == "all") {
					return this.todos;

				} else if (this.filterStat == "active") {
					return this.todos.filter(function (item) {
						return !item.completed;
					})

				} else {
					return this.todos.filter(function (item) {
						return item.completed;
					})
				}

			}
        },
        
		methods: {
			addTodo(event) {
				let title = event.target.value.trim();
				if (title == "") {
					return;
				}
				// 在数组最后一个后面id+1
				var lastTodo = this.todos[this.todos.length - 1]
				let id = lastTodo ? lastTodo.id + 1 : 1;
				console.log(id);
				this.todos.push({
					id: id,
					title: title,
					completed: false
				});
                event.target.value = "";

               
			},

			// 切换所有完成/未完成
			toggleAll(event) {
				console.log(event.target.checked);
				// 1、获取单击的复选框的状态
				var completed = event.target.checked;
				// 2、让所有的完成的状态设置为复选框的状态
				this.todos.forEach(item => {
					item.completed = completed;
				});

			},

			// 删除单个任务
			removeTodo(index, $event) {
				console.log($event);
                this.todos.splice(index, 1);
                // 删除当前任务并重新存储
                window.localStorage.setItem("addTodo",JSON.stringify(this.todos));
                // window.localStorage.getItem("addTodo");
			},

			// 删除所有已完成的任务
			removeAllCompleted() {
				/*
				// 这种方法不能一次性完全删除
				this.todos.forEach((item,index)=>{
				    if(item.completed) {
				        app.todos.splice(index,1);
				    }
				});
				*/

				/* 
				// 可行的方案
				for(let i=0; i<todos.length; i++){
				    if(app.todos[i].completed) {
				     app.todos.splice(i,1);
				    }
				}
				*/
				// es6 filter过滤
				app.todos = app.todos.filter(function (item) {
					return !item.completed;
				})
			},

			// 保存编辑 按回车或是去焦点
			saveEdit(item, index, event) {
				// 1、那道文本框的值
				var editText = event.target.value.trim();
				// 2、对文本框进行飞空校验
				if (!editText.length) {
					// 从数组中删除改元素
					return this.todos.splice(index, 1);
				}

				// 文本框不为空
				item.title = editText;

				// 3、去除editing样式
				this.currentItem = null;
            },
            
            // 全选联动效果
            // toggle(item,event) {
            //     // console.log(event.target.checked);
            //     // console.log(item.completed);
            //     Vue.nextTick(() =>{
            //         // console.log(this);
            //         // 遍历todos
            //         var bool = this.todos.every(function(item) {
            //             return item.completed;
            //         })
            //         app.toggleStat = bool;
            //     })
                
            // }


        },
         
        // 自定义局部指令
        directives: {
            // 指令名称  可以驼峰式命名 也可以命名为字符串 使用指令统一用v-edit-focus
            "edit-focus": {
                /* // 钩子函数
                bind: function(el) {
                    console.log("bind");
                    console.dir(el.parentElement);
                },
                // 指令的定义
                inserted: function(el) {
                    console.log("inserted");
                    console.dir(el.parentElement);
                }, */
                update(el,binding) {
                    console.log(binding.value);
                    if(binding.value) {
                        el.focus();
                    }
                }
                /*,
                componentUpdated() {
                    console.log("componentUpdated");
                },
                unbind() {
                    console.log("unbind");
                }
                */
            }
        }
	});
    window.onhashchange = function() {
        let hash = window.location.hash.substr(2) || "all";
        // console.log(hash);
        app.filterStat = hash;
    }
    window.onhashchange();


})(Vue);

