<template>
    <div>
    <button id="get" @click="get" style="height:20px;width:20px;"></button>
    <input type="text" v-model="gets" placeholder="get"><br>
    <button id="post" @click="post" style="height:20px;width:20px;"></button>
    <input type="text" v-model="posts" placeholder="post"><br>
    <button id="put" @click="put" style="height:20px;width:20px;"></button>
    <input type="text" v-model="puts" placeholder="put"><br>
    <button id="dele" @click="dele" style="height:20px;width:20px;"></button>
    <input type="text" v-model="deles" placeholder="dele"><br>

    </div>
</template>



<script>
import Axios from 'axios'
export default{
    name:"postman",
    data(){
        return {
            gets: "http://localhost:8888",
            posts: "",
            puts: "",
            deles: ""
        }

    },
    methods:{
        get(){
            console.log(this.gets);
            this.axios.get(this.gets).then((res)=>{console.log(res)})
        },
        post(){
            console.log(gets);
            // Axios.get(gets).then((res)=>{console.log(res)})
        },
        put(){
            console.log(gets);
            // Axios.get(gets).then((res)=>{console.log(res)})
        },
        dele(){
            console.log(gets);
            // Axios.get(gets).then((res)=>{console.log(res)})
        }

    }
}

</script>