from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import json
import bcrypt

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'

# Configure the static route
app.add_url_rule('/static/<path:filename>', endpoint='custom_static', view_func=app.send_static_file)

app.secret_key = '002234BY'  # Replace 'your_secret_key' with a strong, random key


# Load user data from the JSON file


def load_user_data():
    with open('users.json', 'r') as users_file:
        return json.load(users_file)


# Save user data back to the JSON file


def save_user_data(users_data):
    with open('users.json', 'w') as users_file:
        json.dump(users_data, users_file, indent=2)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Load user data
        users_data = load_user_data()

        # Hash the password securely
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Add the new user data to the JSON file
        new_user = {"username": username, "password": hashed_password.decode('utf-8'), "adopted_pets": []}
        users_data['users'].append(new_user)

        # Save the updated data back to the JSON file
        save_user_data(users_data)

        return redirect(url_for('login'))
    return render_template('registration.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Load user data
        users_data = load_user_data()

        for user in users_data['users']:
            if user['username'] == username:
                if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                    flash('Login successful!', 'success')
                    session['logged_in'] = True
                    session['username'] = username
                    print("User logged in:", session['username'])  # Add this line for debugging
                    print("Session logged_in:", session.get('logged_in'))  # Add this line for debugging
                    return redirect(url_for('dashboard'))

        flash('Login failed. Check your credentials.', 'danger')

    print("Session logged_in (outside if):", session.get('logged_in'))  # Add this debugging statement
    return render_template('login.html', user=session)


@app.route('/')
def landing():
    return render_template('landing.html')


@app.route('/dashboard')
def dashboard():
    if 'logged_in' in session and session['logged_in']:
        # Load user data from users.json
        users_data = load_user_data()
        # Find the user by their username
        username = session['username']
        user = next((u for u in users_data['users'] if u['username'] == username), None)

        if user:
            # Render the dashboard template with user data
            return render_template('dashboard.html', user=session, adopted_pets=user.get("adopted_pets", []))

        else:
            flash('You need to log in first.', 'danger')
            return redirect(url_for('login'))

    else:
        flash('You need to log in first.', 'danger')
        return redirect(url_for('login'))


@app.route('/adopt_pet', methods=['POST'])
def adopt_pet():
    if 'logged_in' in session and session['logged_in']:
        # Get the pet name from the request
        data = request.get_json()
        pet_name = data.get('petName')

        # Check if the pet name is provided
        if pet_name:
            # Update the user's information in the database to mark pet adoption
            users_data = load_user_data()  # Load user data from users.json
            username = session['username']

            # Find the user by their username
            user = next((u for u in users_data['users'] if u['username'] == username), None)


        else:
            return jsonify({"error": "Please enter a pet name."})
    else:
        return jsonify({"error": "You need to log in to adopt a pet."})



@app.route('/reset_pet')
def reset_pet():
    # Clear pet-related data
    user_data = load_user_data()
    username = session['username']
    user = next((u for u in user_data['users'] if u['username'] == username), None)
    if user:
        user['pet_name'] = None
        save_user_data(user_data)
    # Reset the adopted pet
    return redirect(url_for('dashboard'))


@app.route('/logout')
def logout():
    session.clear()  # Clear the user's session
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)
