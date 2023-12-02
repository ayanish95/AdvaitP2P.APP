const template = `<style>
table,
th,
td {
    border: 1px solid black;
    border-collapse: collapse;
    font-size: 15px;
    height: 15px;
}

container {
    font-size: x-small;
    font-family: sans-serif;
}

@media print {
    button {
        width: 100%;
        display: none;
    }
}
</style>
<div class="container" id="MyPrintID" style="margin: 3px; padding-top: ##PIXAL; position: relative; height: 1000px;">
<!-- Header Table -->
<div class="row">
    <table class="table" style="width: 100%">
        <tbody>
            <tr>
                <td style="width: 30%; height: auto">
                <img style="width: 50%" src="./assets/images/logo.png" alt="logo" class="brand-logo align-middle m-2">
                </td>
                <td style="text-align: center;">
                    <p>
                        <b>Advait Business Solutions PVT LTD. </b>
                    </p>
                </td>
                <td text-align: center;">
                </td>
            </tr>
        </tbody>
        <tbody>
            <tr style="height:50px">
                <td colspan="2">
                    <p style="display: block;margin-left: auto;margin-right: auto;width: 40%;height: 50%,text-align: center;">
                        <b>Purchase Order</b>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<!-- Header Table End-->
<!-- Order Table -->
<div class="row" style="padding-top: 10px">
    <table class="table" style="width: 100%; text-align: left">
    <tbody>
            <tr>
                <td>
                    <b>PO No :</b>  ##Pono
                </td>
                <td><b>PO Date :</b> ##Podate</td>
            </tr>
        </tbody>
        <tbody>
            <tr>
                <td>
                    <b>Supplier Code :</b>  ##Suppliercode
                </td>
                <td><b>Plant Name :</b> ##Plantname</td>
            </tr>
        </tbody>
        <tbody>
            <tr>
               <td><b>Supplier Name :</b>  ##Suppliername</td>
            </tr>
        </tbody>
        <tbody>
        <tr>
           <td><b>Supplier Address :</b>  ##Supplieradd</td>
            <td><b>Plant Address :</b> ##Plantadd</td>
        </tr>
    </tbody>
    <tbody>
        <tr>
           <td><b>Supplier Contact :</b>  ##Suppliercon</td>
            <td><b>Plant Contact :</b> ##Plantcon</td>
        </tr>
    </tbody>
    <tbody>
    <tr>
       <td><b>Supplier Email :</b>  ##Supplieremail</td>
        <td><b>Plant Email :</b> ##Plantemail</td>
    </tr>
</tbody>
<tbody>
<tr>
   <td><b>Supplier GSTIN :</b>  ##Suppliergstin</td>
    <td><b>Plant GSTIN :</b> ##Plantgstin</td>
</tr>
</tbody>
<tbody>
<tr>
   <td><b>Supplier PAN :</b>  ##Supplierpan</td>
    <td><b>Plant PAN :</b> ##Plantpan</td>
</tr>
</tbody>
</div>

<div class="row" id="page" style="padding-top: 10px;">
    <table class="table" style="width: 100%; text-align: center">
        <thead>
            <tr>
                <th>No</th>
                <th>Product Code</th>
                <th>Product Description</th>
                <th>HSN/SAC</th>
                <th>QTY</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Delivery Date</th>
                <th>Total Net Value</th>
            </tr>
        </thead>
        <tbody>
        ##ORDERITEM
        ##TOTAL
       </tbody>
    </table>
</div>
<div class="row" id="footer" style="position: absolute; width: 100%; bottom: 0; left: 0;">
   
##GRANDTABLE
</div>
<!-- Term and Condition Table End-->
<!-- Footer -->
<!-- Footer End-->
</div>`;

export default template;
