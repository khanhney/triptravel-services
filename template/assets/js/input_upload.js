function readURL(input) {
            if (input.files && input.files[0]) {
                var reader        = new FileReader();
                    reader.onload = function(e) {
                    $('#imagePreview').css('background-image', 'url('+e.target.result +')');
                    $('#imagePreview').hide();
                    $('#imagePreview').fadeIn(650);
                }
                reader.readAsDataURL(input.files[0]);
            }
        }
        $("#imageUpload").change(function() {

            readURL(this);


            var fd    = new FormData();
            var files = $(this)[0].files[0];
            fd.append('image', files);
            
            let tripID = $(this).attr('_idTrip');
            
            $.ajax({
                url        : `/upload-image-trip/${tripID}`,
                method     : 'POST',
                data       : fd,
                contentType: false,
                processData: false,
                success    : function(resp) { 
                    console.log({ resp });
                    if (resp.error) return toastr.error('Cập Nhật Thất Bại', 'Thông Báo Up Ảnh');
                    return toastr.success('Cập Nhật Thành Công', 'Thông Báo Up Ảnh')
                },
                error: function(err) {
                    console.log({ err })
                }
            })
           
        });