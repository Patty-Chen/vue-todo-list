import Vue from 'vue';
import AV from 'leancloud-storage'

var APP_ID = 'UsXqjixSnjwzAtKM76UX6JMI-gzGzoHsz';
var APP_KEY = 'jjbYnqnyLKSFeRnqfXl8uGPY';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

  var app1 = new Vue({
  el: '#app',
  data: {
    newTodo: '',
    todoList: [],
    done: false,
    actionType: 'signUp',
    currentUser: null,
    formData: {
      username: '',
      password: ''
    },
  },
  created: function(){
   
    window.onbeforeunload = ()=>{
      let dataString = JSON.stringify(this.todoList);
      window.localStorage.setItem('myTodos', dataString); 
    }
    let oldDataString = window.localStorage.getItem('myTodos');
    let oldData = JSON.parse(oldDataString);
    this.todoList = oldData || [];

  },
  methods: {
    addTodo: function(){
      if(this.newTodo){
        this.todoList.push({
          title: this.newTodo,
          done: this.done,
          createdAt: new Date()
        });
      }
      console.log(this.todoList);
      this.newTodo = '';
    },
    removeTodo: function(itemToRemove){
      this.todoList.splice(this.todoList.indexOf(itemToRemove),1);
    },
    signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then(function (loginedUser) {
        console.log(loginedUser);
      }, function (error) {
      });
      console.log("signUp called");
    },
    logIn: function(){
      AV.User.logIn(this.formData.username, this.formData.password).then(function (loginedUser) {
        console.log(loginedUser);
      }, function (error) {
      });
    }
  }
});


