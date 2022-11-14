export const receiptTemplate = `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script> -->
  <title>RECIBO</title>  
  <style>
  @@styleFile
  </style>
  <script>
			//function generatePDF() {
				// // Choose the element that our invoice is rendered in.
				// const element = document.getElementById('invoice-POS');
				// // Choose the element and save the PDF for our user.
				// html2pdf().from(element).save();
				//window.print();
			//}			
         function imprimir() {
             window.print();
         }      
		</script>
</head>
<body id="bodyIt">
<!-- partial:index.partial.html -->
<div id="invoice-POS">    
<h2 style="text-align: right;">No. 00@@numero_recibo</h2>
<h2 style="text-align: left;">Fact No. @@numero_factura</h2>
    <center id="top">
      <div class="logo"></div>
      <div class="info"> 
        <h2>Recibo de caja</h2>
      </div><!--End Info-->
    </center><!--End InvoiceTop-->    
    <div id="mid">
      <div class="info">
        <h2>Cliente</h2>
        <p> 
			<strong>Nombre :</strong>    @@nombre</br>
            <strong>Direccion :</strong> @@direccion</br>
            <strong>Email :</strong>     @@email</br>
            <strong>Telefono :</strong>  @@telefono</br>
			<strong>Proyecto :</strong>  @@proyecto</br>
        </p>
      </div>
    </div><!--End Invoice Mid-->
    
    <div id="bot">

					<div id="table">
						<table>
						<tr class="tabletitle">
							<td class="item"><h2>&nbsp;&nbsp;Fecha de pago</h2></td>
							<td class="payment_amount"><h2>Monto</h2></td>
							<td class="payment_method"><h2>Metodo de pago</h2></td>
							<td class="rate"><h2># Documento</h2></td>
							<td class="item"><h2>Descripcion</h2></td>
					  </tr>
					  @@itemList
							<tr class="tabletitle">
							<td></td>
							<td></td>
							<td></td>
								<td class="Rate"><h2>Total Pagado</h2></td>
								<td class="payment"><h2>Q.@@total_pagado</h2></td>
							</tr>

							<tr class="tabletitle">
							<td></td>
							<td></td>
							<td></td>
								<td class="Rate"><h2>Total pendiente</h2></td>
								<td class="payment"><h2>Q.@@total_pendiente</h2></td>
							</tr>

						</table>
					</div><!--End Table-->

					<div id="legalcopy">
						<p class="legal"><strong>Este recibo y la operacion que origine es nula</strong> si el metodo de pago es rechazado por cualquier motivo
						</p>
					</div>

				</div><!--End InvoiceBot-->
  </div><!--End Invoice-->
<!-- partial -->
<button class="oculto-impresion" onclick="imprimir()">Imprimir</button>
</body>
</html>
`