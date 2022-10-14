
export const styleReceipt = `
body{
  zoom:140%;
}
#invoice-POS {
    box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
    padding: 5mm;
    margin: 0 auto;
    width: 120mm;
    background: #FFF;
  }
  #invoice-POS ::selection {
    background: #f31544;
    color: #FFF;
  }
  #invoice-POS ::moz-selection {
    background: #f31544;
    color: #FFF;
  }
  #invoice-POS h1 {
    font-size: 1.5em;
    color: #222;
  }
  #invoice-POS h2 {
    font-size: 0.9em;
  }
  #invoice-POS h3 {
    font-size: 1.2em;
    font-weight: 300;
    line-height: 2em;
  }
  #invoice-POS p {
    font-size: 0.7em;
    color: #666;
    line-height: 1.2em;
  }
  #invoice-POS #top, #invoice-POS #mid, #invoice-POS #bot {
    /* Targets all id with 'col-' */
    border-bottom: 1px solid #EEE;
  }
  #invoice-POS #top {
    min-height: 100px;
  }
  #invoice-POS #mid {
    min-height: 80px;
  }
  #invoice-POS #bot {
    min-height: 50px;
  }
  #invoice-POS #top .logo {
    height: 60px;
    width: 155px;
    background: url(@@cabisaLogo) no-repeat;
    background-size: 155px 60px;
  }
  #invoice-POS .clientlogo {
    float: left;
    height: 60px;
    width: 60px;
    background: url(@@cabisaLogo) no-repeat;
    background-size: 60px 60px;
    border-radius: 50px;
  }
  #invoice-POS .info {
    display: block;
    margin-left: 0;
  }
  #invoice-POS .title {
    float: right;
  }
  #invoice-POS .title p {
    text-align: right;
  }
  #invoice-POS table {
    width: 100%;
    border-collapse: collapse;
  }
  #invoice-POS .tabletitle {
    font-size: 0.5em;
    background: #EEE;
  }
  #invoice-POS .service {
    border-bottom: 1px solid #EEE;
  }
  #invoice-POS .item {
    width: 24mm;
  }
  #invoice-POS .rate {
    width: 18mm;
  }
  #invoice-POS .payment_method {
    width: 19mm;
  }
  #invoice-POS .payment_amount {
    width: 16mm;
  }
  #invoice-POS .itemtext {
    font-size: 0.5em;
  }
  #invoice-POS #legalcopy {
    margin-top: 5mm;
  }
  @media print {
    .oculto-impresion,
    .oculto-impresion * {
    display: none !important;
    }
  }
  `