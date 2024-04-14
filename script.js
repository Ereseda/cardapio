const menu = document.getElementById("menu")
const carBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter= document.getElementById("cart-count")
const addressImput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

//Abrir o Modal do carrinho
carBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display="flex";
   
})
//Fechar o Modal quando clicar fora
cartModal.addEventListener("click", function(event){
   if(event.target === cartModal){
    cartModal.style.display = "none"
   }
})

//fechar botão

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display="none"
})

//item menu
menu.addEventListener("click", function(event){
   
   let parentButton = event.target.closest(".add-to-cart-btn")   
   if(parentButton){
    const name= parentButton.getAttribute("data-name")
    const price= parseFloat(parentButton.getAttribute("data-price"))  
    addToCart(name,price)

   }
})
// função para adicionar no carrinho

function addToCart(name, price){   
    const existItem = cart.find(item=> item.name === name) 
    if(existItem){
        //Se o item já existe aumenta somente  a quantidade.+1
        existItem.quantity +=1;
    }else{

        cart.push({
            name,
            price,
            quantity:1,
        })
    }
    
   
    updateCartModal()
}

//Atualiza carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;
    cart.forEach(item=>{
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
            <p class="font-bold">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
            </div>
         
                <button class="remove-from-cart-btn" data-name ="${item.name}">
                    Remover 
                </button>
        
        </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style : "currency", currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

//função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name= event.target.getAttribute( "data-name")
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1){
        const item = cart[index];
       if(item.quantity > 1){
        item.quantity -= 1;
        updateCartModal();
        return;
       }
       cart.splice(index,1);
       updateCartModal();
    }
}

addressImput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !==""){
        addressImput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }    
})
//finalizar pedido

checkoutBtn.addEventListener("click", function(){

    const IsOpen = checkRestaurantOpen();
    if(!IsOpen){
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,                    
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "#ef4444",
            },
        }).showToast();
        return;
    }
    
    
    if(cart.length === 0 )return;
    if(addressImput.value ===""){
        addressWarn.classList.remove("hidden")
        addressImput.classList.add("border-red-500")
        return;
    }

    //Verificar o pedido para api do whatsapp
    const cartItems = cart.map((item)=>{
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
        )
    }).join("")
    const message = encodeURIComponent(cartItems)
    const phone="5512992527180"
    window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressImput.value}`, "_blank")
    cart =[];
    updateCartModal();
})

//Verificar a hora e manipular o card do orário
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const IsOpen = checkRestaurantOpen();

if(IsOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}