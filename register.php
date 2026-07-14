<?php
require_once "db.php";

$error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $fullName = trim($_POST["full_name"]);
    $studentId = trim($_POST["student_id"]);
    $email = trim($_POST["email"]);
    $password = $_POST["password"];
    $confirmPassword = $_POST["confirm_password"];

    // Validation
    if (empty($fullName) || empty($studentId) || empty($email) || empty($password) || empty($confirmPassword)) {

        $error = "Please fill in all fields.";

    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

        $error = "Invalid email address.";

    } elseif ($password != $confirmPassword) {

        $error = "Passwords do not match.";

    } else {

        // Check duplicate email
        $check = $conn->prepare("SELECT id FROM users WHERE email=?");
        $check->bind_param("s", $email);
        $check->execute();
        $result = $check->get_result();

        if ($result->num_rows > 0) {

            $error = "An account with this email already exists.";

        } else {

            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $role = "student";

            $insert = $conn->prepare("INSERT INTO users (full_name, student_id, email, password, role) VALUES (?, ?, ?, ?, ?)");
            $insert->bind_param("sssss", $fullName, $studentId, $email, $hashedPassword, $role);

            if ($insert->execute()) {

                header("Location: login.php?registered=1");
                exit();

            } else {

                $error = "Registration failed.";

            }

            $insert->close();
        }

        $check->close();
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Register | CampusBite</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">

<link rel="stylesheet" href="css/style.css">

<style>

body{
font-family:Inter,sans-serif;
background:#f4f4f4;
margin:0;
padding:0;
}

.auth-page{
display:flex;
justify-content:center;
align-items:center;
height:100vh;
}

.auth-box{
width:420px;
background:#fff;
padding:30px;
border-radius:12px;
box-shadow:0 0 15px rgba(0,0,0,.15);
}

.auth-title{
text-align:center;
margin-bottom:10px;
}

.auth-subtitle{
text-align:center;
margin-bottom:20px;
color:#666;
}

.auth-form label{
display:block;
margin-top:12px;
font-weight:600;
}

.auth-form input{
width:100%;
padding:10px;
margin-top:5px;
border:1px solid #ccc;
border-radius:6px;
}

.auth-btn{
width:100%;
padding:12px;
margin-top:20px;
background:#007bff;
color:#fff;
border:none;
border-radius:6px;
font-size:16px;
cursor:pointer;
}

.auth-btn:hover{
background:#0056b3;
}

.error{
background:#ffdede;
color:#b00020;
padding:10px;
border-radius:6px;
margin-bottom:15px;
}

.auth-switch{
margin-top:20px;
text-align:center;
}

</style>

</head>

<body>

<section class="auth-page">

<div class="auth-box">

<h2 class="auth-title">Create Your Account</h2>

<p class="auth-subtitle">
Register to continue
</p>

<?php if($error!=""){ ?>

<div class="error">
<?php echo htmlspecialchars($error); ?>
</div>

<?php } ?>

<form method="POST" class="auth-form">

<label>Full Name</label>
<input type="text" name="full_name" required>

<label>Student ID</label>
<input type="text" name="student_id" required>

<label>Email</label>
<input type="email" name="email" required>

<label>Password</label>
<input type="password" name="password" required>

<label>Confirm Password</label>
<input type="password" name="confirm_password" required>

<button type="submit" class="auth-btn">
Register
</button>

</form>

<p class="auth-switch">
Already have an account?
<a href="login.php">Login Here</a>
</p>

</div>

</section>

</body>

</html>
