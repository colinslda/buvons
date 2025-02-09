document.addEventListener('DOMContentLoaded', () => {
    const waterAmountInput = document.getElementById('waterAmount');
    const addWaterButton = document.getElementById('addWater');
    const totalWaterDisplay = document.getElementById('totalWater');
    const waterLogList = document.getElementById('waterLog');
    const resetButton = document.getElementById('resetButton'); // Récupération du bouton Réinitialiser

    loadWaterData();
    updateTotalWater();

    addWaterButton.addEventListener('click', () => {
        const amount = parseInt(waterAmountInput.value);
        if (!isNaN(amount) && amount > 0) {
            addWaterIntake(amount);
            waterAmountInput.value = '';
        } else {
            alert("Veuillez entrer une quantité d'eau valide.");
        }
    });

    resetButton.addEventListener('click', () => { // Listener pour le bouton Réinitialiser
        resetDailyWaterIntake();
    });

    function addWaterIntake(amount) {
        const now = new Date();
        const entry = {
            amount: amount,
            timestamp: now.toISOString()
        };

        let waterEntries = getWaterEntries();
        waterEntries.push(entry);
        saveWaterEntries(waterEntries);
        updateTotalWater();
        addWaterLogItem(entry);
    }

    function updateTotalWater() {
        const todayEntries = getTodayWaterEntries();
        const totalTodayMl = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
        const totalTodayL = (totalTodayMl / 1000).toFixed(2); // Conversion en litres et formatage
        totalWaterDisplay.textContent = `Total: ${totalTodayL}L`; // Affichage en litres
    }

    function getTodayWaterEntries() {
        const waterEntries = getWaterEntries();
        const today = new Date().toDateString();
        return waterEntries.filter(entry => new Date(entry.timestamp).toDateString() === today);
    }

    function getWaterEntries() {
        const entries = localStorage.getItem('waterEntries');
        return entries ? JSON.parse(entries) : [];
    }

    function saveWaterEntries(entries) {
        localStorage.setItem('waterEntries', JSON.stringify(entries));
    }

    function addWaterLogItem(entry) {
        const listItem = document.createElement('li');
        const date = new Date(entry.timestamp);
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        listItem.textContent = `${timeString} - ${entry.amount}ml`;
        waterLogList.insertBefore(listItem, waterLogList.firstChild);
    }

    function loadWaterData() {
        const todayEntries = getTodayWaterEntries();
        todayEntries.forEach(entry => addWaterLogItem(entry));
    }

    function resetDailyWaterIntake() { // Fonction pour réinitialiser
        localStorage.removeItem('waterEntries'); // Supprime les entrées du localStorage
        totalWaterDisplay.textContent = `Total: 0L`; // Réinitialise l'affichage du total
        waterLogList.innerHTML = ''; // Vide la liste des logs affichés
    }
});
