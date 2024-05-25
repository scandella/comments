!function(){var t=this,e=!0,i=/xyz/.test((function(){xyz}))?/\b__super__\b/:/.*/;Base=function(e){if(this==t)return Base.extend(e)},Base.extend=function(t){function n(){e&&this.init&&this.init.apply(this,arguments)}function s(t){for(var e in t)t.hasOwnProperty(e)&&(n[e]=t[e])}var o=this.prototype;e=!1;var r=new this;return e=!0,n.include=function(t){for(var e in t)if("include"==e)if(t[e]instanceof Array)for(var a=0,c=t[e].length;a<c;++a)n.include(t[e][a]);else n.include(t[e]);else if("extend"==e)if(t[e]instanceof Array)for(var a=0,c=t[e].length;a<c;++a)s(t[e][a]);else s(t[e]);else t.hasOwnProperty(e)&&(r[e]="function"==typeof t[e]&&"function"==typeof o[e]&&i.test(t[e])?function(t,e){return function(){return this.__super__=o[t],e.apply(this,arguments)}}(e,t[e]):t[e])},n.include(t),n.prototype=r,n.constructor=n,n.extend=arguments.callee,n}}(),Comments={},Comments.translations={},Comments.Base=Base.extend({addClass:function(t,e){t.classList?t.classList.add(e):t.className+=" "+e},removeClass:function(t,e){t.classList?t.classList.remove(e):t.className=t.className.replace(new RegExp("(^|\\b)"+e.split(" ").join("|")+"(\\b|$)","gi")," ")},toggleClass:function(t,e){if(t.classList)t.classList.toggle(e);else{var i=t.className.split(" "),n=i.indexOf(e);n>=0?i.splice(n,1):i.push(e),t.className=i.join(" ")}},createElement:function(t){var e=document.createElement("div");return e.innerHTML=t,e.firstChild},serialize:function(t){var e=new FormData(t);return e.set(Comments.csrfTokenName,Comments.csrfToken),e},serializeObject:function(t){var e=Object.keys(t).map((function(e){return encodeURIComponent(e)+"="+encodeURIComponent(t[e])}));return e.push(encodeURIComponent(Comments.csrfTokenName)+"="+encodeURIComponent(Comments.csrfToken)),e.join("&")},ajax:function(t,e){e=e||{};var i=new XMLHttpRequest;i.open(e.method||"GET",t,!0),i.setRequestHeader("X-Requested-With","XMLHttpRequest"),i.setRequestHeader("Accept","application/json"),"formData"!=e.contentType&&i.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),i.onreadystatechange=function(t){if(4===i.readyState)try{var n=JSON.parse(i.responseText);200===i.status&&e.success?n.errors?e.error(n):e.success(n):200!=i.status&&e.error&&(n.error&&(n=[[n.error]]),e.error(n))}catch(t){e.error([t])}},i.send(e.data||"")},addListener:function(t,e,i,n){t&&t.addEventListener(e,i.bind(this),n||!0)},remove:function(t){t&&t.parentNode.removeChild(t)},clearNotifications:function(t){var e=t.querySelectorAll('[data-role="notice"], [data-role="errors"]');e&&Array.prototype.forEach.call(e,(function(t,e){t.innerHTML=""}))},setNotifications:function(t,e,i){if(i&&e)if("error"===t){var n=i.errors||i;Object.keys(n).forEach((function(t){e.querySelector('[data-role="errors"]').innerHTML=n[t][0]}))}else"validation"===t?Object.keys(i).forEach((function(t){var n=e.querySelector('[name="fields['+t+']"]');n||(n=e.querySelector('[name="fields['+t+'][]"]')),n&&(n.nextElementSibling.innerHTML=i[t][0])})):e.querySelector('[data-role="notice"]').innerHTML=i},checkCaptcha:function(t,e){if(!Comments.recaptchaEnabled)return e(t,this);grecaptcha.execute(Comments.recaptchaKey,{action:"commentForm"}).then((function(i){return t.append("g-recaptcha-response",i),e(t,this)}))},postForm:function(t,e,i){var n=t.target,s=this.serialize(n),o=n.querySelector('[type="submit"]');this.clearNotifications(n),this.addClass(o,"loading"),this.checkCaptcha(s,function(t){this.ajax(Comments.baseUrl+e,{method:"POST",contentType:"formData",data:t,success:function(t){this.removeClass(o,"loading"),t.notice&&this.setNotifications("notice",n,t.notice),t.success?i(t):this.setNotifications("validation",n,t.errors)}.bind(this),error:function(t){this.removeClass(o,"loading"),this.setNotifications("validation",n,t.errors)}.bind(this)})}.bind(this))},t:function(t){return Comments.translations.hasOwnProperty(t)?Comments.translations[t]:""},makeUniqueID:function(t="ID"){var e=(new Date).getTime(),i;return window.performance&&"function"==typeof window.performance.now&&(e+=performance.now()),t+"_"+"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(t){var i=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"==t?i:3&i|8).toString(16)}))},find:function(t,e){removeId=!1,null===t.getAttribute("id")&&(t.setAttribute("id",this.makeUniqueID()),removeId=!0);let i=document.querySelector("#"+t.getAttribute("id")+" > "+e);return removeId&&t.removeAttribute("id"),i},emit:function(t,e){const i="comments:"+t;document.dispatchEvent(new CustomEvent(i,{detail:e}))}}),Comments.Instance=Comments.Base.extend({comments:{},init:function(t,e){this.settings=e;var i=document.querySelector(t),n=i.querySelectorAll('[data-role="comment"]');Comments.baseUrl=e.baseUrl+"/comments/comments/",Comments.csrfTokenName=e.csrfTokenName,Comments.csrfToken=e.csrfToken,Comments.translations=e.translations,Comments.recaptchaEnabled=e.recaptchaEnabled,Comments.recaptchaKey=e.recaptchaKey,this.$commentsContainer=i.querySelector('[data-role="comments"]'),this.$baseForm=i.querySelector('[data-role="form"]'),this.$subscribeBtn=i.querySelector('[data-action="subscribe"]'),this.addListener(this.$baseForm,"submit",this.onSubmit,!1),this.addListener(this.$subscribeBtn,"click",this.subscribe);for(var s=0;s<n.length;s++){var t=n[s].getAttribute("data-id");this.comments[t]=new Comments.Comment(this,n[s])}setTimeout(function(){if(this.$baseForm){var t=this.$baseForm.querySelector('[name="'+Comments.csrfTokenName+'"]');t&&(Comments.csrfToken=t.value)}}.bind(this),2e3),this.commentForm=this.$baseForm.cloneNode(!0),this.emit("init",{comments:this})},onSubmit:function(t){t.preventDefault(),this.postForm(t,"save",function(t){if(t.html){var e=this.createElement(t.html),i=this.$commentsContainer.insertBefore(e,this.$commentsContainer.firstChild);this.comments[t.id]=new Comments.Comment(this,e),this.$baseForm.querySelector("form").reset(),location.hash="#comment-"+t.id,this.emit("submit",{comments:this})}t.success&&(this.$baseForm.querySelector("form").reset(),this.emit("submit",{comments:this}))}.bind(this))},subscribe:function(t){t.preventDefault();var e=this.settings.element.id,i=this.settings.element.siteId,n=this.$subscribeBtn.parentNode;this.clearNotifications(n),this.toggleClass(this.$subscribeBtn,"is-subscribed"),this.ajax(Comments.baseUrl+"subscribe",{method:"POST",data:this.serializeObject({ownerId:e,siteId:i}),success:function(t){if(!t.success)throw new Error(t)}.bind(this),error:function(t){t.errors&&this.setNotifications("error",n,t.errors)}.bind(this)})}}),Comments.Comment=Comments.Base.extend({init:function(t,e){this.instance=t,this.$element=e,this.commentId=e.getAttribute("data-id"),this.siteId=e.getAttribute("data-site-id"),this.$replyContainer=this.find(e,'[data-role="wrap-content"] > [data-role="reply"]'),this.$repliesContainer=this.find(e,'[data-role="wrap-content"] > [data-role="replies"]');var i=this.find(e,'[data-role="wrap-content"] > [data-role="content"]');this.$replyBtn=i.querySelector('[data-action="reply"]'),this.$editBtn=i.querySelector('[data-action="edit"]'),this.$deleteForm=i.querySelector('[data-action="delete"]'),this.$flagForm=i.querySelector('[data-action="flag"]'),this.$upvoteForm=i.querySelector('[data-action="upvote"]'),this.$downvoteForm=i.querySelector('[data-action="downvote"]'),this.$subscribeBtn=i.querySelector('[data-action="subscribe"]'),this.replyForm=new Comments.ReplyForm(this),this.editForm=new Comments.EditForm(this),this.addListener(this.$replyBtn,"click",this.reply),this.addListener(this.$editBtn,"click",this.edit),this.addListener(this.$deleteForm,"submit",this.delete),this.addListener(this.$flagForm,"submit",this.flag),this.addListener(this.$upvoteForm,"submit",this.upvote),this.addListener(this.$downvoteForm,"submit",this.downvote),this.addListener(this.$subscribeBtn,"click",this.subscribe)},reply:function(t){t.preventDefault(),this.replyForm.isOpen?(this.$replyBtn.innerHTML=this.t("reply"),this.replyForm.closeForm(),this.instance.emit("reply-close",{comment:this})):(this.$replyBtn.innerHTML=this.t("close"),this.replyForm.openForm(),this.instance.emit("reply-open",{comment:this}))},edit:function(t){t.preventDefault(),this.editForm.isOpen?(this.$editBtn.innerHTML=this.t("edit"),this.editForm.closeForm(),this.instance.emit("edit-close",{comment:this})):(this.$editBtn.innerHTML=this.t("close"),this.editForm.openForm(),this.instance.emit("edit-open",{comment:this}))},delete:function(t){t.preventDefault(),this.clearNotifications(this.$element);var e=this.serialize(t.target),i="remove";this.instance.settings.trashAction&&(i=this.instance.settings.trashAction);var n=this.find(this.$element,'[data-role="wrap-content"] > [data-role="content"] > [data-role="body"] > [data-role="message"]');1==confirm(this.t("delete-confirm"))&&this.ajax(Comments.baseUrl+"trash",{method:"POST",contentType:"formData",data:e,success:function(t){"remove"===i?this.$element.parentNode.removeChild(this.$element):"message"===i&&n?n.innerHTML=this.instance.settings.trashActionMessage:"refresh"===i&&location.reload(),this.instance.emit("delete",{comment:this})}.bind(this),error:function(t){this.setNotifications("error",this.$element,t)}.bind(this)})},flag:function(t){t.preventDefault();var e=this.serialize(t.target);this.clearNotifications(this.$element),this.ajax(Comments.baseUrl+"flag",{method:"POST",contentType:"formData",data:e,success:function(t){this.toggleClass(this.$flagForm.parentNode,"has-flag"),t.notice&&(console.log(t.notice),this.setNotifications("notice",this.$element,t.notice)),this.instance.emit("flag",{comment:this})}.bind(this),error:function(t){this.setNotifications("error",this.$element,t)}.bind(this)})},upvote:function(t){t.preventDefault();var e=this.serialize(t.target);this.ajax(Comments.baseUrl+"vote",{method:"POST",contentType:"formData",data:e,success:function(t){this.vote(!0),this.instance.emit("upvote",{comment:this})}.bind(this),error:function(t){this.setNotifications("error",this.$element,t)}.bind(this)})},downvote:function(t){t.preventDefault();var e=this.serialize(t.target);this.ajax(Comments.baseUrl+"vote",{method:"POST",contentType:"formData",data:e,success:function(t){this.vote(!1),this.instance.emit("downvote",{comment:this})}.bind(this),error:function(t){this.setNotifications("error",this.$element,t)}.bind(this)})},vote:function(t){var e=this.$element.querySelector('[data-role="likes"]'),i=parseInt(e.textContent,10);i||(i=0),t?i++:i--,0===i&&(i=""),e.textContent=i},subscribe:function(t){t.preventDefault();var e=this.instance.settings.element.id,i=this.siteId,n=this.commentId;this.toggleClass(this.$subscribeBtn,"is-subscribed"),this.ajax(Comments.baseUrl+"subscribe",{method:"POST",data:this.serializeObject({ownerId:e,siteId:i,commentId:n}),success:function(t){if(!t.success)throw new Error(t);this.instance.emit("subscribe",{comment:this})}.bind(this),error:function(t){t.errors}.bind(this)})}}),Comments.ReplyForm=Comments.Base.extend({isOpen:!1,init:function(t){this.comment=t,this.instance=t.instance,this.$element=t.$element,this.$container=t.$replyContainer,this.$repliesContainer=t.$repliesContainer},setFormHtml:function(t){var e=this.instance.commentForm.cloneNode(!0);this.clearNotifications(e),e.querySelector("form").reset(),null!==e.getAttribute("id")&&e.setAttribute("id",this.makeUniqueID(e.getAttribute("id"))),(e.querySelector('input[name="newParentId"]')||{}).value=this.comment.commentId,this.$container.innerHTML=e.outerHTML},openForm:function(t){this.setFormHtml(t),this.isOpen=!0,this.$form=this.$container.querySelector('[role="form"]'),this.$form&&this.addListener(this.$form,"submit",this.onSubmit,!1)},closeForm:function(){this.$container.innerHTML="",this.isOpen=!1},onSubmit:function(t){t.preventDefault(),this.postForm(t,"save",function(t){if(t.html){var e=this.createElement(t.html);this.remove(this.$container.firstChild),this.$repliesContainer.insertBefore(e,this.$repliesContainer.firstChild),this.instance.comments[t.id]=new Comments.Comment(this.instance,e),this.comment.$replyBtn.innerHTML=this.t("reply"),this.isOpen=!1,this.instance.emit("reply-submit",{reply:this})}t.success&&(this.$form.reset(),this.instance.emit("reply-submit",{reply:this}))}.bind(this))}}),Comments.EditForm=Comments.Base.extend({isOpen:!1,init:function(t){this.comment=t,this.instance=t.instance,this.$element=t.$element,this.$container=t.$replyContainer,this.$comment=this.$element.querySelector('[data-role="message"]'),this.commentText=this.$comment.innerHTML.replace(/<[^>]+>/g,"").trim()},setFormHtml:function(){var t=this.instance.commentForm.cloneNode(!0);this.clearNotifications(t),this.remove(t.querySelector('[name="fields[name]"]')),this.remove(t.querySelector('[name="fields[email]"]')),this.remove(t.querySelector(".cc-i-figure")),null!==t.getAttribute("id")&&t.setAttribute("id",this.makeUniqueID(t.getAttribute("id"))),t.querySelector('[name="fields[comment]"]').innerHTML=this.commentText,t.querySelector('[type="submit"]').innerHTML=this.t("save"),(t.querySelector('input[name="commentId"]')||{}).value=this.comment.commentId,this.$comment.innerHTML=t.outerHTML},openForm:function(){this.setFormHtml(),this.isOpen=!0,this.addListener(this.$comment.querySelector('[role="form"]'),"submit",this.onSubmit,!1)},closeForm:function(){var t;this.$element.querySelector('[data-role="message"]').innerHTML="<p>"+this.commentText.replace(/\n/g,"<br>")+"</p>",this.isOpen=!1},onSubmit:function(t){t.preventDefault(),this.postForm(t,"save",function(t){var e=this.$element.querySelector('[data-role="message"]'),i=this.$element.querySelector('[name="fields[comment]"]').value;e.innerHTML="<p>"+i.replace(/\n/g,"<br>\n")+"</p>",this.comment.editForm=new Comments.EditForm(this.comment),this.comment.$editBtn.innerHTML=this.t("edit"),this.isOpen=!1,this.instance.emit("edit-submit",{edit:this})}.bind(this))}});
//# sourceMappingURL=comments.js.map