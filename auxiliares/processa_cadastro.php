<?php

$servername = "127.0.0.1";
$username = "u437700539_manyadmin";
$password = "#SenhaAdminLanding*#Page2bRincando";
$dbname = "u437700539_cadastro_LP";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$nome = $_POST['name'];
$email = $_POST['email'];
$whatsapp = $_POST['whatsapp'];
$mensagem = $_POST['message'];
$newsletter_opt_in = isset($_POST['newsletter']) ? 1 : 0;

$sql = "INSERT INTO cadastros (nome, email, whatsapp, mensagem, newsletter_opt_in) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $nome, $email, $whatsapp, $mensagem, $newsletter_opt_in);

if ($stmt->execute()) {
    header("Location: cadastro_sucesso.html");
    exit();
} else {
    echo "Erro: " . $stmt->error;
}

$stmt->close();
$conn->close();

?>
