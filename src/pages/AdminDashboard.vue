<template>
    <div class="row">
      <div class="col-12">
        <card>
          <div class="table-responsive">
            <h1>List Merchants</h1>
            <div class="search">
              <input type="text" class="form-control" placeholder="Search" v-model="search">
            </div>
             <table class="table is-striped is-bordered mt-2 is-fullwidth">
               <thead>
                  <tr>
                    <th>Merchant</th>
                    <th class="has-text-centered">Actions</th>
                  </tr>
               </thead>
               <tbody>

                    <tr v-for="user in users" :key="user.id">
                      <td>{{ user.storeName }}</td>
                      <td class="has-text-centered">
                         <router-link :to="{ path: 'profileMerchant', query: { id: user.id }}">

                          <button tag="a"  class="btn" >Profile</button >
                          </router-link>
                        <button class="btn" @click="deleteMerchant(user.id)">Delete</button>
                         
                      </td>
                    </tr>
                </tbody>
             </table>
          </div>
        </card>
      </div>

      <el-pagination 
        background
        layout="prev, pager, next"
        v-model="pagination"
        :total="total"
        :page-size="pageSize"
        @current-change="page">
      </el-pagination>
    </div>
</template>
<script>
import axios from "axios";
import _ from "lodash";
import BaseButton from '../components/BaseButton.vue';

export default {
  components: { BaseButton },
    name:"merchantsList",
    data() {
      return {
        users: [],
        search: '',
        pageSize: 5,
        total:'',
        currPage: 0,
        showModal: false
      };
    },
    created() {
      this.getMerchants();
      this.getMerchants = _.debounce(this.getMerchants, 400)
    },
    watch: {
      search(value){
        this.getMerchants(value);
      }
    },
    methods: {
      async getMerchants() {
        try {
          const response = await axios.get(`http://localhost:3000/admin/user/active?page=${this.currPage}&search=${this.search}`);
          this.users = response.data.rows;
          this.total = response.data.count
        } catch (err) {
          console.log(err);
        }
      },
      // async getMerchantProfile(){
      //   try{
      //     const response = await axios.get("http://localhost:3000/admin/user")
      //     //INI HARUSNYA DIRECT KE PAGE PROFILE?
      //   } catch (err) {
      //     console.log(err)
      //   }
      // },

      
      async deleteMerchant(val) {
        let answer = window.confirm("Are You Sure?")
        if (answer) {
          try {
           await axios.delete(`http://localhost:3000/admin/user/${val}`);
            this.getMerchants();
          }catch (err) {
            console.log(err);
          }
        }else{
          return
        }

        
      },
      async searchMerchant(value){
        try{
          var response = await axios.get("http://localhost:3000/admin/user?search=" + encodeURIComponent(value))
          this.users = response.data.rows
        } catch(err) {
          console.log(err)
        }
      },
      page(val){
        this.currPage = val-1
        this.getMerchants(val)
      }
    }
    
};
</script>
<style>
</style>
