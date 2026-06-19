// Send the visitor to the product showcase (#shop, on the home page).
// On the home page we smooth-scroll to it. From any other route we navigate
// home with the #shop hash and Home scrolls to it on mount (see Home.jsx).
export function goToShop(navigate) {
  const el = document.getElementById('shop')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  } else if (navigate) {
    navigate('/#shop')
  } else {
    window.location.href = '/#shop'
  }
}
