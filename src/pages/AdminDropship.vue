<template>
    <div class="row">
      <div class="col-12">
        <card>
          <div class="table-responsive">
            <h1>Dropships History</h1>

            <div class="search">
               <input type="text" class="form-control" placeholder="Search by Item & Name" v-model="search">
              
            </div>
            
             <table class="table is-striped is-bordered mt-2 is-fullwidth">
               <thead>
                  <tr>
                    <th>Qty</th>
                    <th>Product Name</th>
                    <th>Customer Name</th>
                    <th>Customer Phone</th>
                    <th>Province</th>
                    <th>City</th>
                    <th>Postal Code</th>
                    <th>Address</th>
                    <th>Shipment Price</th>
                    <th>Payment Invoice</th>
                    <th>Note</th>
                    <th>Status</th>
                
                    <th class="has-text-centered">Actions</th>
                  </tr>
               </thead>
               <tbody>

                    <tr v-for="dropship in dropships" :key="dropship.id">
                      
                      <td>{{ dropship.qty }}</td>
                      <td>{{ dropship.products[0] ? dropship.products[0].name : ""}}</td>
                      <td>{{ dropship.customer.name }}</td>
                      <td>{{ dropship.customer.phone }}</td>
                      <td>{{ dropship.city.province_name }}</td>
                      <td>{{ dropship.city.city_name }}</td>
                      <td>{{ dropship.city.postal_code }}</td>
                      <td>{{ dropship.address }}</td>
                      <td>{{ dropship.shipmentPrice }}</td>
                      <td>{{ dropship.paymentInvoice }}</td>
                      <td>{{ dropship.note }}</td>
                      <td>{{ dropship.status }}</td>

                      
                      <!-- <td>{{ dropship.paymentInvoice }}</td> //ini buat apa ya? ada paymentInvoice?
                      <td>{{ dropship.note }}</td>
                      <td>{{ dropship.status }}</td> -->
                      <td class="has-text-centered">
                        <button class="btn" v-if="dropship.status == 'PENDING APPROVAL' || dropship.status == 'PENDING PAYMENT' && dropship.paymentInvoice != null" @click="updateStatus(dropship.id)"
                        
                          >Approve</button >
                        
                            <!-- <router-link :to="{ path: 'tracking', query: { id: user.id }}"> -->

                          <button tag="a"  class="btn" v-if="dropship.status == 'ON PACKAGING'" @click="donePackaging(dropship.id)">Done Packaging</button >
                          <!-- </router-link> -->

                          <button class="btn" v-if="dropship.status != 'REJECTED' && dropship.status != 'CANCELED' && dropship.status != 'COMPLETE' && !dropship.status.includes('ON SHIPMENT')" @click="rejectProduct(dropship.id)">Reject</button>
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
    name:"dropshipsList",
    data() {
      return {
        dropships: [],
        search: '',
        pageSize: 5,
        total:'',
        currPage: 0
      };
    },
    created() {
      this.getDropships();
       this.getDropships = _.debounce(this.getDropships, 400);
    },
     watch: { //ini bagian dari untuk search
      search(value){
        this.getDropships(value); 
      }
    },
    methods: {
      async getDropships() {
        try {
          const response = await axios.get(`http://localhost:3000/admin/dropship/all?page=${this.currPage}&search=${this.search}`);
          this.dropships = response.data.rows;
          this.total = response.data.count
        } catch (err) {
          console.log(err)
        }
      },
      async updateStatus(val) {
        try {
          await axios.post(`http://localhost:3000/admin/dropship/approve/${val}`);
          alert('Product Approved')
          this.getDropships();
        }catch (err) {
          console.log(err);
        }
      },
      async rejectProduct(val) {
        let answer = window.confirm("Are You Sure ?")
        if(answer) {
          try {
            await axios.post(`http://localhost:3000/admin/dropship/reject/${val}`);
            alert('Product Rejected')
            this.getDropships();
          }catch (err) {
            console.log(err);
          }
        }else{
          return
        }
      },
      async donePackaging(val){
        let answer = confirm('Are you sure this product has properly packaged')

        if(answer){
          await axios.post(`http://localhost:3000/admin/dropship/ship/${val}`)
          this.getDropships()
        }
      },
      page(val){
        this.currPage = val-1
        this.getDropships(val)
      },
    }
};
</script>
<style>


</style>
