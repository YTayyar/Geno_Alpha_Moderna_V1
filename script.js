document.getElementById('knownMW').addEventListener('change', function() {
    var mwInput = document.getElementById('mw');
    // Toggle the Molecular Weight input visibility based on the checkbox
    if (this.checked) {
        mwInput.style.display = 'block';
        mwInput.previousElementSibling.style.display = 'block'; // Label
    } else {
        mwInput.style.display = 'none';
        mwInput.previousElementSibling.style.display = 'none'; // Label
    }
});

function calculateFormulation() {
    // Extract values from the form
    var type = document.getElementById('type').value;
    var strands = document.getElementById('strands').value;
    var length = parseFloat(document.getElementById('length').value);
    var knownMW = document.getElementById('knownMW').checked;
    var mw = knownMW ? parseFloat(document.getElementById('mw').value) : 0;
    var concentration = parseFloat(document.getElementById('concentration').value);
    var amount = parseFloat(document.getElementById('amount').value);
    var npRatio = parseFloat(document.getElementById('npRatio').value);

    // Calculate Molecular Weight if not provided
    if (!knownMW) {
        if (type === 'DNA') {
            mw = strands === 'single' ? (length * 303.7) + 79 : (length * 607.4) + 157.9;
        } else if (type === 'RNA') {
            mw = strands === 'single' ? (length * 320.5) + 159 : (length * 641) + 318;
        }
    }

    // Perform calculations
    var moles = ((amount / 1000) / mw) * length;
    var lipidMoles = moles * npRatio;
    var lipidAmount = lipidMoles * 710.2 * 1000;
    var lipidVolume = lipidAmount / 13.116;
    var constructVolume = amount / concentration;
    
    var totalVolume = parseFloat(document.getElementById('totalVolume').value);

    // Total lipid phase = totalVolume / (1 + 3.75)???
    var lipidPhaseVolume = totalVolume / 4.75;
    var aqueousPhaseVolume = totalVolume - lipidPhaseVolume;

    var bufferVolume = aqueousPhaseVolume - constructVolume;
    var ethanolVolume = lipidPhaseVolume - lipidVolume;


    // Display the results
    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h3>Instructions to Use the Kit:</h3>
        <p>Mix ${bufferVolume.toFixed(3)} mL of 40mM Citrate Buffer (pH=4) with ${constructVolume.toFixed(3)} mL of your construct and add them to their respective compartment.</p>
        <p>Mix ${ethanolVolume.toFixed(3)} mL of Ethanol with ${lipidVolume.toFixed(3)} mL of lipid mixture and add them to their respective compartment.</p>
    `;
    resultsDiv.style.display = 'block';

    // New Section: Display detailed calculations
    var calculationsDiv = document.getElementById('calculations');
    calculationsDiv.innerHTML = `
        <h3>Calculation Details:</h3>
        <p>Molecular Weight (MW): ${mw.toFixed(2)}</p>
        <p>Number of moles of the construct (moles): ${moles.toExponential(3)} mol</p>
        <p>Required moles of ionizable Lipids (lipid moles): ${lipidMoles.toExponential(3)} mol</p>
        <p>Weight of the ionizable lipid (lipid amount): ${lipidAmount.toFixed(2)} mg</p>
        <p>Volume of the lipids (lipid volume): ${lipidVolume.toFixed(2)} mL</p>
        <p>Volume of the construct (construct volume): ${constructVolume.toFixed(2)} mL</p>
        <p>Amount of added ethanol (ethanol volume): ${ethanolVolume.toFixed(2)} mL</p>
        <p>Amount of added buffer (buffer volume): ${bufferVolume.toFixed(2)} mL</p>
    `;
    calculationsDiv.style.display = 'block';


}



// Attach the calculateFormulation function to the button's click event
document.querySelector('button').addEventListener('click', calculateFormulation);
