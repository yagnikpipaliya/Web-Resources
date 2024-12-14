 // Import the functions you need from the SDKs you need
        // import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
        // import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
        // import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js';
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
        import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";

        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries

        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {
            apiKey: "AIzaSyC2SWES3kdhIY2gnQz8ZdgNOxQ3Je2M548",
            authDomain: "test-d8211.firebaseapp.com",
            projectId: "test-d8211",
            storageBucket: "test-d8211.firebasestorage.app",
            messagingSenderId: "399658200896",
            appId: "1:399658200896:web:bea08f21a95889318f14a5",
            measurementId: "G-KHBLPXBCZ9",
            databaseURL: "https://test-d8211-default-rtdb.firebaseio.com/" 
        };

        // Initialize Firebase

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        // const app = initializeApp(firebaseConfig);
        // const db = getDatabase(app);
        // Initialize Firebase
        const db = getDatabase(app);
        console.log(analytics, db)
        console.log("Firebase Database URL:", firebaseConfig.databaseURL);

        // Function to get categories from Firebase
        function getCategories() {
            const dbRef = ref(db, 'categories/');
            get(dbRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const categories = snapshot.val();
                    console.log(categories);
                    populateCategories(categories);  // Pass the categories object to the populate function
                } else {
                    console.log("No categories available");
                }
            }).catch((error) => {
                console.error("Error fetching categories: ", error);
            });
        }

        // Populate categories in the category dropdown and category list
        function populateCategories(categories) {
            const categorySelect = document.getElementById('resourceCategory');
            const categoryList = document.getElementById('categoryList');
            categorySelect.innerHTML = '';
            categoryList.innerHTML = '';
            Object.keys(categories).forEach(categoryId => {
                const categoryName = categories[categoryId];
                const option = document.createElement('option');
                option.value = categoryName;
                option.textContent = categoryName;
                categorySelect.appendChild(option);

                const li = document.createElement('li');
                li.textContent = categoryName;
                categoryList.appendChild(li);
            });
        }

        // Add new category to Firebase
        document.getElementById('addCategoryBtn').addEventListener('click', () => {
            const newCategory = document.getElementById('newCategory').value;
            if (newCategory.trim() === '') return;
            const newCategoryRef = ref(db, 'categories/' + newCategory);
            set(newCategoryRef, newCategory).then(() => {
                getCategories();  // Refresh categories after adding
                document.getElementById('newCategory').value = '';  // Clear input
                Swal.fire('Success!', 'Category added successfully', 'success');
            }).catch(error => {
                Swal.fire('Error', 'Failed to add category: ' + error.message, 'error');
            });
        });

        // Add new resource to Firebase
        document.getElementById('resourceForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const resourceTitle = document.getElementById('resourceTitle').value;
            const resourceLink = document.getElementById('resourceLink').value;
            const resourceCategory = document.getElementById('resourceCategory').value;
            const resourceTag = document.getElementById('resourceTag').value;
            const resourceId = new Date().getTime().toString();

            const resourceRef = ref(db, 'resources/' + resourceId);
            set(resourceRef, {
                title: resourceTitle,
                link: resourceLink,
                category: resourceCategory,
                tag: resourceTag
            }).then(() => {
                Swal.fire('Success!', 'Resource added successfully', 'success');
                document.getElementById('addResourceModal').classList.add('hidden');
                getResources();  // Refresh resource table after adding
            }).catch((error) => {
                Swal.fire('Error', 'Failed to add resource: ' + error.message, 'error');
            });
        });

        // Fetch and display resources from Firebase
        function getResources() {
            const dbRef = ref(db, 'resources/');
            get(dbRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const resources = snapshot.val();
                    console.log('resources', resources)
                    const resourceTable = document.getElementById('resourceTable');
                    resourceTable.innerHTML = ''; // Clear existing rows
                    Object.keys(resources).forEach(resourceId => {
                        const resource = resources[resourceId];
                        const row = document.createElement('tr');
                        row.innerHTML = `
              <td class="px-4 py-2">${resource.title}</td>
              <td class="px-4 py-2"><a href="${resource.link}" target="_blank" class="text-blue-500">View</a></td>
              <td class="px-4 py-2">
                <button class="px-4 py-2 bg-red-500 text-white rounded" onclick="deleteResource('${resourceId}')">Delete</button>
              </td>
            `;
                        resourceTable.appendChild(row);
                    });
                } else {
                    console.log("No resources available");
                }
            });
        }

        // Delete resource from Firebase
        function deleteResource(resourceId) {
            const resourceRef = ref(db, 'resources/' + resourceId);
            set(resourceRef, null).then(() => {
                Swal.fire('Deleted', 'Resource deleted successfully', 'success');
                getResources();  // Refresh table after deletion
            }).catch((error) => {
                Swal.fire('Error', 'Failed to delete resource: ' + error.message, 'error');
            });
        }

        // Modal toggle logic
        document.getElementById('addResourceBtn').addEventListener('click', () => {
            document.getElementById('addResourceModal').classList.remove('hidden');
        });

        document.getElementById('cancelModal').addEventListener('click', () => {
            document.getElementById('addResourceModal').classList.add('hidden');
        });

        document.getElementById('closeCategoryModal').addEventListener('click', () => {
            document.getElementById('categoryModal').classList.add('hidden');
        });

        // Initial data load
        getCategories();
        console.log(getCategories())
        getResources();