import Vue from 'vue';
import AV from 'leancloud-storage'

var APP_ID = 'UsXqjixSnjwzAtKM76UX6JMI-gzGzoHsz';
var APP_KEY = 'jjbYnqnyLKSFeRnqfXl8uGPY';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});
var Todo = AV.Object.extend('Todo');

  var app1 = new Vue({
  el: '#app',
  data: {
    newTodo: '',
    todoList: [],
    todo: null,
    done: false,
    actionType: 'signUp',
    currentUser: null,
    formData: {
      username: '',
      password: ''
    },
  },
  created: function(){
    this.currentUser = this.getCurrentUser();
    if(this.currentUser){
        this.readTodo();
    }
  },
  methods: {
    saveTodo: function(){
      let acl = new AV.ACL();
      acl.setReadAccess(AV.User.current(),true);
      acl.setWriteAccess(AV.User.current(),true); 
      
      this.todo = this.todo || new Todo();
      
      this.todo.set('list', JSON.stringify(this.todoList));
      this.todo.setACL(acl);
      this.todo.save().then(function (todo) {
        console.log('New object created with objectId: ' + todo.id);
      }, function (error) {
        console.error('Failed to create new object, with error message: ' + error.message);
      });
    },
    readTodo: function(){
      let query = new AV.Query('Todo');
      query.find().then( (todos)=> {
          console.log("readTodo");
          console.log(todos);
          this.todo = todos[0];
          this.todoList = JSON.parse(todos[0].attributes.list);
          console.log("todoList");
          console.log(this.todoList);
        }, function(error){
          console.error(error); 
      });
    },
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
      this.saveTodo();
    },
    removeTodo: function(itemToRemove){
      this.todoList.splice(this.todoList.indexOf(itemToRemove),1);
      this.saveTodo();
    },
    signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {
        this.currentUser = this.getCurrentUser(); 
      }, (error) => {
        alert('注册失败'); 
      });
    },
    login: function () {
      AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
        this.currentUser = this.getCurrentUser(); 
        this.readTodo();
      }, function (error) {
        alert('登录失败'); 
      });
    },
    getCurrentUser: function () { 
      let {id, createdAt, attributes: {username}} = AV.User.current() || {};
      return {id, username, createdAt};
    },
    logout:function (){
      AV.User.logOut();
      this.currentUser = AV.User.current();
      this.todo = null;
      this.todoList = [];
    }
  }
});


