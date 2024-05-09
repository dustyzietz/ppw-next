<?php
/* Template Name: Custom Login Page */
get_header();
?>
<div id="login-register-password">

    <?php global $user_ID, $user_identity;
    if (!$user_ID) { ?>

        <ul class="tabs_login">
            <li class="active_login"><a href="#tab1_login">Login</a></li>
            <li><a href="#tab2_login">Register</a></li>
            <li><a href="#tab3_login">Forgot?</a></li>
        </ul>
        <div class="tab_container_login">
            <div id="tab1_login" class="tab_content_login">

                <?php $register = $_GET['register'];
                $reset = $_GET['reset'];
                if ($register == true) { ?>

                    <h3>Success!</h3>
                    <p>Check your email for the password and then return to log in.</p>

                <?php } elseif ($reset == true) { ?>

                    <h3>Success!</h3>
                    <p>Check your email to reset your password.</p>

                <?php } else { ?>

                    <h3>Have an account?</h3>
                    <p>Log in or sign up! It’s fast & <em>free!</em></p>

                <?php } ?>

                <form id="custom-login-form" method="post" action="<?php bloginfo('url') ?>/wp-login.php" class="wp-user-form">
                    <div class="username">
                        <label for="user_login"><?php _e('Username'); ?>: </label>
                        <input type="text" name="log" value="<?php echo esc_attr(stripslashes($user_login)); ?>" size="20" id="user_login" tabindex="11" />
                    </div>
                    <div class="password">
                        <label for="user_pass"><?php _e('Password'); ?>: </label>
                        <input type="password" name="pwd" value="" size="20" id="user_pass" tabindex="12" />
                    </div>
                    <div class="login_fields">
                        <div class="rememberme">
                            <label for="rememberme">
                                <input type="checkbox" name="rememberme" value="forever" checked="checked" id="rememberme" tabindex="13" /> Remember me
                            </label>
                        </div>
                        <?php do_action('login_form'); ?>
                        <input type="submit" name="user-submit" value="<?php _e('Login'); ?>" tabindex="14" class="user-submit" onclick="customLogin(event)" />
                        <input type="hidden" name="task" value="login" />
                        <input type="hidden" name="redirect_to" value="<?php echo esc_attr($_SERVER['REQUEST_URI']); ?>" />
                        <input type="hidden" name="user-cookie" value="1" />
                    </div>
                </form>
            </div>
            <div id="tab2_login" class="tab_content_login" style="display:none;">
                <!-- Registration form -->
            </div>
            <div id="tab3_login" class="tab_content_login" style="display:none;">
                <!-- Forgot password form -->
            </div>
        </div>

    <?php } else { // is logged in 
        wp_redirect(home_url('/my-account'));
    } ?>
</div>

<script>
    function customLogin(event) {
        event.preventDefault(); // Prevent the default form submission

        // Extract username and password from the form
        var username = document.getElementById('user_login').value;
        var password = document.getElementById('user_pass').value;

        // Make an AJAX request to the WordPress JWT authentication endpoint
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '<?php echo esc_url_raw(rest_url('jwt-auth/v1/token')); ?>', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = JSON.parse(xhr.responseText);
                if (response.token) {
                    // Send token to WordPress endpoint
                    var xhr2 = new XMLHttpRequest();
                    xhr2.open('POST', 'https://pricepointwholesale.com/wp-json/custom/v1/encrypt-token', true);
                    xhr2.setRequestHeader('Content-Type', 'application/json');
                    xhr2.onreadystatechange = function() {
                        if (xhr2.readyState === XMLHttpRequest.DONE) {
                            if (xhr2.status === 200) {
                                console.log('Token encrypted and set as cookie successfully');
                            } else {
                                console.error('Error encrypting token and setting cookie');
                            }
                        }
                    };
                    xhr2.send(JSON.stringify({ token: response.token }));
                } else {
                    alert('Error: Unable to obtain token');
                }
            } else {
                alert('Error: Unable to connect to the server');
            }
        };
        xhr.onerror = function() {
            alert('Error: Unable to connect to the server');
        };
        xhr.send(JSON.stringify({
            username: username,
            password: password
        }));

        // Manually submit the form after executing the custom function
        document.getElementById('custom-login-form').submit();
    }
</script>
<?php
get_footer();
?>