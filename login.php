<?php
session_start();
require_once "db.php";

$error = "";

// যদি আগে থেকেই লগইন করা থাকে
if (isset($_SESSION['user_id'])) {
    header("Location: index.html");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $login = trim($_POST["login"]);
    $password = $_POST["password"];

    if (empty($login) || empty($password)) {
        $error = "Please enter your email/student ID and password.";
    } else {

        $stmt = $conn->prepare("SELECT id, full_name, student_id, email, password, role FROM users WHERE email=? OR student_id=?");

        if (!$stmt) {
            die("Database Error: " . $conn->error);
        }

        $stmt->bind_param("ss", $login, $login);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows == 1) {

            $user = $result->fetch_assoc();

            if (password_verify($password, $user['password'])) {

                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['full_name'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['role'] = $user['role'];

                header("Location: index.html");
                exit();

            } else {

                $error = "Incorrect password.";

            }

        } else {

            $error = "No account found with this Email or Student ID.";

        }

        $stmt->close();
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Login | CampusBite</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/login.css">

<style>

.auth-page{
display:flex;
justify-content:center;
align-items:center;
min-height:100vh;
background:#f5f5f5;
}

.auth-box{
width:400px;
background:#fff;
padding:30px;
border-radius:12px;
box-shadow:0 0 15px rgba(0,0,0,.1);
}

.auth-box h1{
text-align:center;
margin-bottom:10px;
}

.auth-box p{
text-align:center;
}

.auth-form{
margin-top:20px;
}

.auth-form label{
display:block;
margin-top:15px;
font-weight:bold;
}

.auth-form input{
width:100%;
padding:12px;
margin-top:5px;
border:1px solid #ccc;
border-radius:6px;
}

.auth-btn{
width:100%;
margin-top:20px;
padding:12px;
background:#0d6efd;
color:white;
border:none;
border-radius:6px;
font-size:16px;
cursor:pointer;
}

.auth-btn:hover{
background:#0b5ed7;
}

.error{
background:#ffdede;
color:#b30000;
padding:10px;
border-radius:5px;
margin-bottom:15px;
}

.success{
background:#d4edda;
color:#155724;
padding:10px;
border-radius:5px;
margin-bottom:15px;
}

.auth-switch{
margin-top:20px;
text-align:center;
}

</style>

</head>

<body>

<div class="auth-page">

<div class="auth-box">

<h1>CampusBite Login</h1>

<p>Login using your Email or Student ID</p>

<?php if(isset($_GET['registered'])){ ?>

<div class="success">
Registration Successful. Please Login.
</div>

<?php } ?>

<?php if($error!=""){ ?>

<div class="error">
<?php echo htmlspecialchars($error); ?>
</div>

<?php } ?>

<form class="auth-form" method="POST">

<label>Email or Student ID</label>

<input
type="text"
name="login"
placeholder="Enter Email or Student ID"
required>

<label>Password</label>

<input
type="password"
name="password"
placeholder="Enter Password"
required>

<button
type="submit"
class="auth-btn">

Login

</button>

</form>

<div class="auth-switch">

Don't have an account?

<a href="register.php">
Register Here
</a>

</div>

</div>

</div>

</body>
</html>
