
        const FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'; // Replace with your form's action URL
        
        document.getElementById('customForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('entry.123456789', document.getElementById('name').value);   // Replace with actual entry IDs
            formData.append('entry.987654321', document.getElementById('email').value);
            formData.append('entry.456789123', document.getElementById('message').value);
            
            try {
                const response = await fetch(FORM_URL, {
                    method: 'POST',
                    mode: 'no-cors',  // Required for cross-origin
                    body: formData
                });
                alert('Submitted successfully!');
                document.getElementById('customForm').reset();
            } catch (error) {
                alert('Submission failed. Check console.');
                console.error(error);
            }
        });